const User = require('../models/User');

const isValidHttpUrl = (value) => {
  if (!value) return true;
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidDateOnly = (value) => {
  if (!value) return true;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const hasMatchingImageSignature = (mimeType, encodedImage) => {
  const image = Buffer.from(encodedImage, 'base64');
  if (mimeType === 'jpeg') return image.length >= 3 && image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
  if (mimeType === 'png') return image.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
  return mimeType === 'webp'
    && image.length >= 12
    && image.toString('ascii', 0, 4) === 'RIFF'
    && image.toString('ascii', 8, 12) === 'WEBP';
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
      .populate('skills');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, college, degree, branch, graduationYear, bio, profileImage, projects, certifications, resume } = req.body;

    if (String(req.user._id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    if (profileImage !== undefined && typeof profileImage !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Profile photo must be a valid image'
      });
    }

    if (projects !== undefined) {
      if (!Array.isArray(projects)) {
        return res.status(400).json({ success: false, message: 'Projects must be a list' });
      }
      for (const project of projects) {
        if (!project || typeof project.title !== 'string' || !project.title.trim()
          || typeof project.description !== 'string' || !project.description.trim()) {
          return res.status(400).json({ success: false, message: 'Each project needs a title and description' });
        }
        if (!isValidHttpUrl(project.link) || !isValidHttpUrl(project.githubUrl)) {
          return res.status(400).json({ success: false, message: 'Project links must be valid HTTP or HTTPS URLs' });
        }
        if (!isValidDateOnly(project.startDate) || !isValidDateOnly(project.endDate)
          || (project.startDate && project.endDate && project.endDate < project.startDate)) {
          return res.status(400).json({ success: false, message: 'Project dates must be valid and the end date cannot precede the start date' });
        }
      }
    }

    if (certifications !== undefined) {
      if (!Array.isArray(certifications)) {
        return res.status(400).json({ success: false, message: 'Certificates must be a list' });
      }
      for (const certificate of certifications) {
        if (!certificate || typeof certificate.name !== 'string' || !certificate.name.trim()
          || typeof certificate.issuer !== 'string' || !certificate.issuer.trim()) {
          return res.status(400).json({ success: false, message: 'Each certificate needs a name and issuing organization' });
        }
        if (!isValidHttpUrl(certificate.credentialUrl)) {
          return res.status(400).json({ success: false, message: 'Certificate links must be valid HTTP or HTTPS URLs' });
        }
        if (!isValidDateOnly(certificate.date)) {
          return res.status(400).json({ success: false, message: 'Certificate issue date must be valid' });
        }
      }
    }

    if (profileImage?.startsWith('data:')) {
      const imageMatch = profileImage.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
      if (!imageMatch) {
        return res.status(400).json({
          success: false,
          message: 'Profile photo must be a JPG, PNG, or WEBP image'
        });
      }
      const imageSize = Buffer.from(imageMatch[2], 'base64').length;
      if (imageSize === 0 || imageSize > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'Profile photo must be 5 MB or smaller'
        });
      }
      if (!hasMatchingImageSignature(imageMatch[1], imageMatch[2])) {
        return res.status(400).json({
          success: false,
          message: 'Profile photo contents do not match the selected image type'
        });
      }
    } else if (profileImage !== undefined && profileImage
      && !isValidHttpUrl(profileImage) && !profileImage.startsWith('/')) {
      return res.status(400).json({
        success: false,
        message: 'Profile photo must be a supported image or HTTP(S) URL'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (college !== undefined) user.college = college;
    if (degree !== undefined) user.degree = degree;
    if (branch !== undefined) user.branch = branch;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (projects) user.projects = projects;
    if (certifications) user.certifications = certifications;
    if (resume !== undefined) user.resume = resume;

    await user.save();
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Update resume data specifically
exports.updateResume = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user's ID
    const resumeData = req.body;

    if (!resumeData || typeof resumeData !== 'object' || Array.isArray(resumeData)) {
      return res.status(400).json({
        success: false,
        message: 'Resume data must be an object'
      });
    }

    for (const field of ['linkedin', 'github', 'portfolio']) {
      const value = resumeData[field];
      if (value === undefined || value === null || value === '') continue;
      if (typeof value !== 'string' || value.length > 2048) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a valid URL under 2048 characters`
        });
      }

      const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      if (!isValidHttpUrl(url)) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a valid HTTP or HTTPS URL`
        });
      }
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.resume = resumeData;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.resume
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating resume',
      error: error.message
    });
  }
};
