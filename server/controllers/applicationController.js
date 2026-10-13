const Application = require('../models/Application');

// Get all applications for the authenticated user
exports.getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const studentId = req.user.id; // Use authenticated user's ID

    let query = { studentId };

    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('internshipId', 'title company location workMode stipend duration logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
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

// Get single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('studentId', 'name email phone college degree branch')
      .populate('internshipId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if the application belongs to the authenticated user
    if (application.studentId._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

// Create new application
exports.createApplication = async (req, res) => {
  try {
    const { internshipId, resume } = req.body;
    const studentId = req.user.id; // Use authenticated user's ID

    if (!internshipId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide internshipId'
      });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({
      studentId,
      internshipId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this internship'
      });
    }

    const application = await Application.create({
      studentId,
      internshipId,
      resume: resume || '',
      status: 'Applied'
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('studentId', 'name email')
      .populate('internshipId', 'title company');

    res.status(201).json({
      success: true,
      data: populatedApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: error.message
    });
  }
};

// Update application
exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resume } = req.body;
    const studentId = req.user.id; // Use authenticated user's ID

    if (status !== undefined) {
      return res.status(403).json({
        success: false,
        message: 'Application status can only be changed by an administrator'
      });
    }

    if (resume !== undefined && (typeof resume !== 'string' || resume.length > 200000)) {
      return res.status(400).json({
        success: false,
        message: 'Resume data must be text no longer than 200,000 characters'
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if the application belongs to the authenticated user
    if (application.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this application'
      });
    }

    if (resume !== undefined) application.resume = resume;

    await application.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('studentId', 'name email')
      .populate('internshipId', 'title company');

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
