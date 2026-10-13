const SavedInternship = require('../models/SavedInternship');

// Get all saved internships for authenticated user
exports.getAllSavedInternships = async (req, res) => {
  try {
    const studentId = req.user.id; // Use authenticated user's ID

    const savedInternships = await SavedInternship.find({ studentId })
      .populate('internshipId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedInternships.length,
      data: savedInternships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching saved internships',
      error: error.message
    });
  }
};

// Create saved internship
exports.createSavedInternship = async (req, res) => {
  try {
    const { internshipId } = req.body;
    const studentId = req.user.id; // Use authenticated user's ID

    if (!internshipId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide internshipId'
      });
    }

    const savedInternship = await SavedInternship.create({
      studentId,
      internshipId
    });

    const populatedSaved = await SavedInternship.findById(savedInternship._id)
      .populate('internshipId');

    res.status(201).json({
      success: true,
      data: populatedSaved
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Internship already saved'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error saving internship',
      error: error.message
    });
  }
};

// Delete saved internship
exports.deleteSavedInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id; // Use authenticated user's ID

    const savedInternship = await SavedInternship.findById(id);

    if (!savedInternship) {
      return res.status(404).json({
        success: false,
        message: 'Saved internship not found'
      });
    }

    // Check if the saved internship belongs to the authenticated user
    if (savedInternship.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this saved internship'
      });
    }

    await savedInternship.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Saved internship removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing saved internship',
      error: error.message
    });
  }
};
