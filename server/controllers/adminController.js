const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInternships = await Internship.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    const applicationStatuses = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalStudents,
      totalInternships,
      totalApplications,
      applicationStatuses: applicationStatuses.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Get all students with pagination and search
exports.getAllStudents = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    let query = { role: 'student' };
    
    if (search) {
      if (typeof search !== 'string') {
        return res.status(400).json({ success: false, message: 'Search must be text' });
      }
      const searchExpression = new RegExp(escapeRegex(search.trim().slice(0, 100)), 'i');
      query.$or = [
        { name: searchExpression },
        { email: searchExpression },
        { college: searchExpression }
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    if (!Number.isInteger(pageNum) || pageNum < 1
      || !Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ success: false, message: 'Page must be positive and limit must be between 1 and 100' });
    }
    const skip = (pageNum - 1) * limitNum;

    const [students, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page: pageNum,
      totalPages,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get student details
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .select('-password')
      .populate('skills');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Update student (admin can update any student)
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, college, degree, branch, graduationYear, bio, role } = req.body;

    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Only allow role change if the requesting user is also an admin
    if (role && req.user.role === 'admin') {
      student.role = role;
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (college) student.college = college;
    if (degree) student.degree = degree;
    if (branch) student.branch = branch;
    if (graduationYear) student.graduationYear = graduationYear;
    if (bio !== undefined) student.bio = bio;

    await student.save();
    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      success: true,
      data: studentData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Prevent deleting admins
    if (student.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

// Get all applications with filters
exports.getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('studentId', 'name email college degree')
        .populate('internshipId', 'title company location workMode')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: pageNum,
      totalPages,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application status'
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const previousStatus = application.status;
    application.status = status;
    await application.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('studentId', 'name email')
      .populate('internshipId', 'title company');

    if (previousStatus !== status) {
      await Notification.create({
        userId: application.studentId,
        title: 'Application status updated',
        message: `Your application for ${populatedApplication.internshipId?.title || 'an internship'} is now ${status}.`,
        link: '/applications'
      });
    }

    res.status(200).json({
      success: true,
      data: populatedApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
};

// Get application trends for charts
exports.getApplicationTrends = async (req, res) => {
  try {
    const trends = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application trends',
      error: error.message
    });
  }
};
