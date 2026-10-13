const Internship = require('../models/Internship');
const Skill = require('../models/Skill');
const User = require('../models/User');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.searchContent = async (req, res) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Enter a search term'
      });
    }

    const expression = new RegExp(escapeRegex(query), 'i');
    const [internships, skills, user] = await Promise.all([
      Internship.find({
        $or: [
          { title: expression },
          { company: expression },
          { requiredSkills: expression },
          { category: expression }
        ]
      }).select('title company category').sort({ createdAt: -1 }).limit(6),
      Skill.find({
        userId: req.user._id,
        $or: [{ name: expression }, { category: expression }]
      }).select('name category').sort({ createdAt: -1 }).limit(6),
      User.findById(req.user._id).select('projects certifications')
    ]);

    const results = [
      ...internships.map(item => ({
        id: item._id,
        type: 'Internship',
        title: item.title,
        detail: `${item.company} · ${item.category}`,
        href: `/internships/${item._id}`
      })),
      ...skills.map(item => ({
        id: item._id,
        type: 'Skill',
        title: item.name,
        detail: item.category,
        href: '/skills'
      })),
      ...(user?.projects || [])
        .filter(item => expression.test(item.title || '') || expression.test(item.description || ''))
        .slice(0, 4)
        .map((item, index) => ({
          id: item._id || `project-${index}`,
          type: 'Project',
          title: item.title,
          detail: item.description || 'Profile project',
          href: '/profile'
        })),
      ...(user?.certifications || [])
        .filter(item => expression.test(item.name || '') || expression.test(item.issuer || ''))
        .slice(0, 4)
        .map((item, index) => ({
          id: item._id || `certificate-${index}`,
          type: 'Certificate',
          title: item.name,
          detail: item.issuer || 'Profile certificate',
          href: '/profile'
        }))
    ];

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error searching SkillBridge',
      error: error.message
    });
  }
};
