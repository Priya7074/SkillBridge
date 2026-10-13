const Skill = require('../models/Skill');

// Get all skills for authenticated user
exports.getAllSkills = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const skills = await Skill.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message
    });
  }
};

// Create new skill
exports.createSkill = async (req, res) => {
  try {
    const { name, category, level } = req.body;
    const userId = req.user.id; // Use authenticated user's ID

    const normalizedName = typeof name === 'string' ? name.trim() : '';
    if (!normalizedName || !category?.trim?.() || level === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, and level'
      });
    }

    const existingSkill = await Skill.findOne({ userId, name: normalizedName })
      .collation({ locale: 'en', strength: 2 });
    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: 'You have already added this skill'
      });
    }

    const skill = await Skill.create({
      name: normalizedName,
      category: category.trim(),
      level,
      userId
    });

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating skill',
      error: error.message
    });
  }
};

// Update skill
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, level } = req.body;

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    if (skill.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own skills'
      });
    }

    if (name && name.trim().toLowerCase() !== skill.name.toLowerCase()) {
      const duplicate = await Skill.findOne({
        _id: { $ne: skill._id },
        userId: req.user.id,
        name: { $regex: `^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'You have already added this skill'
        });
      }
    }

    if (name) skill.name = name;
    if (category) skill.category = category;
    if (level !== undefined) skill.level = level;

    await skill.save();

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating skill',
      error: error.message
    });
  }
};

// Delete skill
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    if (skill.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own skills'
      });
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting skill',
      error: error.message
    });
  }
};
