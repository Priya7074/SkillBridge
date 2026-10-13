const User = require('../models/User');
const Internship = require('../models/Internship');
const Skill = require('../models/Skill');
const roleSkillMap = require('../config/roleSkillMap');

// Get available roles
exports.getAvailableRoles = async (req, res) => {
  try {
    const roles = Object.keys(roleSkillMap).map(role => ({
      name: role,
      description: roleSkillMap[role].description
    }));

    res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available roles',
      error: error.message
    });
  }
};

// Analyze skill gap for a specific role
exports.analyzeSkillGap = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const userId = req.user.id;

    // Validate target role
    if (!targetRole || !roleSkillMap[targetRole]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target role. Please select a valid role.'
      });
    }

    // Get user's skills from database
    const [user, savedSkills] = await Promise.all([
      User.findById(userId).select('resume'),
      Skill.find({ userId }).select('name')
    ]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Extract user's skill names
    const userSkills = savedSkills.map(skill => skill.name);
    
    // Also include resume skills if available
    if (user.resume && user.resume.skills) {
      userSkills.push(...user.resume.skills);
    }

    // Remove duplicates
    const uniqueUserSkills = [...new Set(userSkills)];

    // Get role requirements
    const roleRequirements = roleSkillMap[targetRole];
    const requiredSkills = roleRequirements.required;
    const preferredSkills = roleRequirements.preferred;

    // Calculate matches
    const matchedRequired = requiredSkills.filter(skill => 
      uniqueUserSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    const matchedPreferred = preferredSkills.filter(skill => 
      uniqueUserSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    const missingRequired = requiredSkills.filter(skill => 
      !matchedRequired.includes(skill)
    );

    const missingPreferred = preferredSkills.filter(skill => 
      !matchedPreferred.includes(skill)
    );

    // Calculate match percentage
    const totalRequired = requiredSkills.length;
    const matchPercentage = totalRequired > 0 
      ? Math.round((matchedRequired.length / totalRequired) * 100) 
      : 0;

    // Get relevant internships
    const relevantInternships = await Internship.find({
      $or: [
        { category: getCategoryForRole(targetRole) },
        { requiredSkills: { $in: requiredSkills } }
      ]
    }).limit(5);

    // Build response
    const analysis = {
      targetRole,
      roleDescription: roleRequirements.description,
      currentSkills: uniqueUserSkills,
      requiredSkills,
      preferredSkills,
      matchedRequired,
      matchedPreferred,
      missingRequired,
      missingPreferred,
      matchPercentage,
      learningRoadmap: roleRequirements.learningRoadmap,
      relevantInternships: relevantInternships.map(internship => ({
        id: internship._id,
        title: internship.title,
        company: internship.company,
        location: internship.location,
        workMode: internship.workMode,
        stipend: internship.stipend,
        requiredSkills: internship.requiredSkills
      })),
      analysisSource: 'rule-based'
    };

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error analyzing skill gap',
      error: error.message
    });
  }
};

// Helper function to map roles to internship categories
function getCategoryForRole(role) {
  const categoryMap = {
    'Frontend Developer': 'Engineering',
    'Backend Developer': 'Engineering',
    'Full Stack Developer': 'Engineering',
    'Software Engineer': 'Engineering',
    'Data Analyst': 'Data Science',
    'UI/UX Designer': 'Design'
  };
  return categoryMap[role] || 'Engineering';
}
