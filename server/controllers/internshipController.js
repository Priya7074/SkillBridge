const Internship = require('../models/Internship');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Get all internships with search, filters, and pagination
exports.getAllInternships = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      workMode,
      minStipend,
      maxStipend,
      skills,
      page = 1,
      limit = 10
    } = req.query;

    const stringFilters = { search, category, location, workMode, skills };
    if (Object.entries(stringFilters).some(([_key, value]) => value !== undefined && typeof value !== 'string')) {
      return res.status(400).json({ success: false, message: 'Search filters must be text values' });
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    if (!Number.isInteger(pageNum) || pageNum < 1
      || !Number.isInteger(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ success: false, message: 'Page must be positive and limit must be between 1 and 50' });
    }

    const minimum = minStipend === undefined || minStipend === '' ? undefined : Number(minStipend);
    const maximum = maxStipend === undefined || maxStipend === '' ? undefined : Number(maxStipend);
    if ((minimum !== undefined && (!Number.isFinite(minimum) || minimum < 0))
      || (maximum !== undefined && (!Number.isFinite(maximum) || maximum < 0))
      || (minimum !== undefined && maximum !== undefined && minimum > maximum)) {
      return res.status(400).json({ success: false, message: 'Enter a valid non-negative stipend range' });
    }

    let query = {};

    // Search in title, company, and skills
    if (search?.trim()) {
      const searchExpression = new RegExp(escapeRegex(search.trim().slice(0, 100)), 'i');
      query.$or = [
        { title: searchExpression },
        { company: searchExpression },
        { requiredSkills: searchExpression }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Location filter
    if (location?.trim()) {
      query.location = { $regex: escapeRegex(location.trim().slice(0, 100)), $options: 'i' };
    }

    // Work mode filter
    if (workMode) {
      query.workMode = workMode;
    }

    // Skills filter
    if (skills?.trim()) {
      query.requiredSkills = { $regex: escapeRegex(skills.trim().slice(0, 100)), $options: 'i' };
    }

    // Stipend range filter
    if (minimum !== undefined || maximum !== undefined) {
      query.stipendAmount = {};
      if (minimum !== undefined) query.stipendAmount.$gte = minimum;
      if (maximum !== undefined) query.stipendAmount.$lte = maximum;
    }

    // Pagination
    const skip = (pageNum - 1) * limitNum;

    const [internships, total] = await Promise.all([
      Internship.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Internship.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: internships.length,
      total,
      page: pageNum,
      totalPages,
      data: internships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching internships',
      error: error.message
    });
  }
};

// Get single internship by ID
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching internship',
      error: error.message
    });
  }
};

// Create new internship
exports.createInternship = async (req, res) => {
  try {
    const {
      title,
      company,
      companyLogo,
      description,
      responsibilities,
      requiredSkills,
      preferredSkills,
      location,
      workMode,
      duration,
      stipend,
      stipendAmount,
      applicationDeadline,
      openings,
      category,
      logo
    } = req.body;

    if (!title || !company || !description || !location || !workMode || !duration || !stipend || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const internship = await Internship.create({
      title,
      company,
      companyLogo: companyLogo || '',
      description,
      responsibilities: responsibilities || [],
      requiredSkills: requiredSkills || [],
      preferredSkills: preferredSkills || [],
      location,
      workMode,
      duration,
      stipend,
      stipendAmount: stipendAmount || 0,
      applicationDeadline,
      openings: openings || 1,
      category,
      logo: logo || ''
    });

    res.status(201).json({
      success: true,
      data: internship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating internship',
      error: error.message
    });
  }
};

// Update internship
exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      company,
      companyLogo,
      description,
      responsibilities,
      requiredSkills,
      preferredSkills,
      location,
      workMode,
      duration,
      stipend,
      stipendAmount,
      applicationDeadline,
      openings,
      category,
      logo
    } = req.body;

    const internship = await Internship.findById(id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    if (title) internship.title = title;
    if (company) internship.company = company;
    if (companyLogo !== undefined) internship.companyLogo = companyLogo;
    if (description) internship.description = description;
    if (responsibilities) internship.responsibilities = responsibilities;
    if (requiredSkills) internship.requiredSkills = requiredSkills;
    if (preferredSkills) internship.preferredSkills = preferredSkills;
    if (location) internship.location = location;
    if (workMode) internship.workMode = workMode;
    if (duration) internship.duration = duration;
    if (stipend) internship.stipend = stipend;
    if (stipendAmount !== undefined) internship.stipendAmount = stipendAmount;
    if (applicationDeadline) internship.applicationDeadline = applicationDeadline;
    if (openings) internship.openings = openings;
    if (category) internship.category = category;
    if (logo !== undefined) internship.logo = logo;

    internship.updatedAt = Date.now();
    await internship.save();

    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating internship',
      error: error.message
    });
  }
};

// Delete internship
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await Internship.findById(id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    await internship.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting internship',
      error: error.message
    });
  }
};
