import { useState, useEffect, useRef } from 'react';
import { getCurrentUser, userAPI, skillAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Calendar, Edit, ExternalLink, Award, Loader2, AlertCircle, Camera, Plus, Pencil, Trash2 } from 'lucide-react';
import Toast from '../components/Toast';
import '../styles/global.css';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22%3E%3Crect width=%22120%22 height=%22120%22 rx=%2260%22 fill=%22%23e0e7ff%22/%3E%3Ccircle cx=%2260%22 cy=%2243%22 r=%2222%22 fill=%22%236366f1%22/%3E%3Cpath d=%22M20 112c3-25 19-37 40-37s37 12 40 37%22 fill=%22%236366f1%22/%3E%3C/svg%3E';

const isValidHttpUrl = (value) => {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const authUserId = authUser?.id || authUser?._id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [toast, setToast] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFormError, setProfileFormError] = useState('');
  const [profileForm, setProfileForm] = useState(null);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [profileSkills, setProfileSkills] = useState([]);
  const [itemFormType, setItemFormType] = useState('');
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [itemForm, setItemForm] = useState({});
  const [itemFormError, setItemFormError] = useState('');
  const [savingItem, setSavingItem] = useState(false);
  const photoInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [response, skillsResponse] = await Promise.all([
        getCurrentUser(),
        skillAPI.getAll()
      ]);
      if (!response.user || !Array.isArray(skillsResponse.data)) {
        throw new Error('The server returned incomplete profile data.');
      }
      setProfileData(response.user);
      setProfileSkills(skillsResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authUserId) return undefined;
    let active = true;
    const loadProfile = async () => {
      try {
        const [response, skillsResponse] = await Promise.all([
          getCurrentUser(),
          skillAPI.getAll()
        ]);
        if (!active) return;
        if (!response.user || !Array.isArray(skillsResponse.data)) {
          throw new Error('The server returned incomplete profile data.');
        }
        setProfileData(response.user);
        setProfileSkills(skillsResponse.data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError('Failed to fetch profile');
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadProfile();
    return () => {
      active = false;
    };
  }, [authUserId]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>Loading profile...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const currentUser = profileData || authUser;

  const openEditForm = () => {
    setProfileForm({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      college: currentUser?.college || '',
      degree: currentUser?.degree || '',
      branch: currentUser?.branch || '',
      graduationYear: currentUser?.graduationYear || '',
      bio: currentUser?.bio || ''
    });
    setProfileFormError('');
    setShowEditForm(true);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (savingProfile) return;

    const name = profileForm.name.trim();
    if (!name) {
      setProfileFormError('Full name is required.');
      return;
    }

    const graduationYear = profileForm.graduationYear === ''
      ? null
      : Number(profileForm.graduationYear);
    if (graduationYear !== null && !Number.isInteger(graduationYear)) {
      setProfileFormError('Graduation year must be a whole number.');
      return;
    }

    try {
      setSavingProfile(true);
      setProfileFormError('');
      const userId = currentUser.id || currentUser._id;
      const response = await userAPI.update(userId, {
        name,
        phone: profileForm.phone.trim(),
        college: profileForm.college.trim(),
        degree: profileForm.degree.trim(),
        branch: profileForm.branch.trim(),
        graduationYear,
        bio: profileForm.bio.trim()
      });
      const updatedProfile = { ...currentUser, ...response.data, id: userId };
      delete updatedProfile.password;
      setProfileData(updatedProfile);
      updateUser(updatedProfile);
      setShowEditForm(false);
      setToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (err) {
      setProfileFormError(err.message || 'Failed to save profile changes.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePhotoSelection = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setPhotoError('');
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError('Choose a JPG, JPEG, PNG, or WEBP image.');
      setShowPhotoForm(true);
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError('The image must be 5 MB or smaller.');
      setShowPhotoForm(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreview(reader.result);
        setShowPhotoForm(true);
      } else {
        setPhotoError('Unable to preview this image.');
      }
    };
    reader.onerror = () => setPhotoError('Unable to read this image.');
    reader.readAsDataURL(file);
  };

  const closePhotoForm = () => {
    if (savingPhoto) return;
    setShowPhotoForm(false);
    setPhotoPreview('');
    setPhotoError('');
  };

  const handleSavePhoto = async () => {
    if (!photoPreview || savingPhoto) return;

    try {
      setSavingPhoto(true);
      setPhotoError('');
      const userId = currentUser.id || currentUser._id;
      const response = await userAPI.update(userId, { profileImage: photoPreview });
      const updatedProfile = { ...currentUser, ...response.data, id: userId };
      delete updatedProfile.password;
      setProfileData(updatedProfile);
      updateUser(updatedProfile);
      setShowPhotoForm(false);
      setPhotoPreview('');
      setToast({ message: 'Profile photo updated successfully', type: 'success' });
    } catch (err) {
      setPhotoError(err.message || 'Failed to upload profile photo.');
    } finally {
      setSavingPhoto(false);
    }
  };

  const openPhotoPicker = () => photoInputRef.current?.click();

  const openItemForm = (type, item = null, index = null) => {
    setItemFormType(type);
    setEditingItemIndex(index);
    setItemFormError('');
    if (type === 'skill') {
      setItemForm(item
        ? { name: item.name, category: item.category, proficiency: item.level >= 80 ? 'advanced' : item.level >= 60 ? 'intermediate' : 'beginner' }
        : { name: '', category: '', proficiency: 'beginner' });
    } else if (type === 'project') {
      setItemForm(item
        ? {
          ...item,
          technologies: (item.technologies || []).join(', '),
          link: item.link || '',
          githubUrl: item.githubUrl || '',
          startDate: item.startDate || '',
          endDate: item.endDate || ''
        }
        : { title: '', description: '', technologies: '', link: '', githubUrl: '', startDate: '', endDate: '' });
    } else {
      setItemForm(item
        ? { ...item, date: item.date || '', credentialId: item.credentialId || '', credentialUrl: item.credentialUrl || '' }
        : { name: '', issuer: '', date: '', credentialId: '', credentialUrl: '' });
    }
  };

  const closeItemForm = () => {
    if (savingItem) return;
    setItemFormType('');
    setEditingItemIndex(null);
    setItemFormError('');
  };

  const saveItem = async (event) => {
    event.preventDefault();
    if (savingItem) return;
    const userId = currentUser.id || currentUser._id;
    setItemFormError('');

    try {
      setSavingItem(true);
      if (itemFormType === 'skill') {
        const name = itemForm.name.trim();
        const category = itemForm.category.trim();
        if (!name || !category) {
          setItemFormError('Skill name and category are required.');
          return;
        }
        if (profileSkills.some((skill, index) =>
          index !== editingItemIndex && skill.name.toLowerCase() === name.toLowerCase()
        )) {
          setItemFormError('You have already added this skill.');
          return;
        }
        const level = { beginner: 30, intermediate: 60, advanced: 90 }[itemForm.proficiency];
        if (editingItemIndex === null) {
          const response = await skillAPI.create({ name, category, level });
          setProfileSkills(previous => [response.data, ...previous]);
        } else {
          const skill = profileSkills[editingItemIndex];
          const response = await skillAPI.update(skill._id, { name, category, level });
          setProfileSkills(previous => previous.map(item => item._id === skill._id ? response.data : item));
        }
      } else if (itemFormType === 'project') {
        const title = itemForm.title.trim();
        const description = itemForm.description.trim();
        const technologies = itemForm.technologies.split(',').map(value => value.trim()).filter(Boolean);
        if (!title || !description) {
          setItemFormError('Project title and description are required.');
          return;
        }
        if (!isValidHttpUrl(itemForm.link) || !isValidHttpUrl(itemForm.githubUrl)) {
          setItemFormError('Project URLs must start with http:// or https://.');
          return;
        }
        if (itemForm.startDate && itemForm.endDate && itemForm.endDate < itemForm.startDate) {
          setItemFormError('Project end date cannot be earlier than its start date.');
          return;
        }
        const projects = [...(currentUser.projects || [])];
        const project = {
          title,
          description,
          technologies,
          link: itemForm.link.trim(),
          githubUrl: itemForm.githubUrl.trim(),
          startDate: itemForm.startDate,
          endDate: itemForm.endDate
        };
        if (editingItemIndex === null) projects.push(project);
        else projects[editingItemIndex] = { ...projects[editingItemIndex], ...project };
        const response = await userAPI.update(userId, { projects });
        const updatedProfile = { ...currentUser, ...response.data, id: userId };
        delete updatedProfile.password;
        setProfileData(updatedProfile);
        updateUser(updatedProfile);
      } else {
        const name = itemForm.name.trim();
        const issuer = itemForm.issuer.trim();
        if (!name || !issuer) {
          setItemFormError('Certificate name and issuing organization are required.');
          return;
        }
        if (!isValidHttpUrl(itemForm.credentialUrl)) {
          setItemFormError('Credential URL must start with http:// or https://.');
          return;
        }
        const certifications = [...(currentUser.certifications || [])];
        const certification = {
          name,
          issuer,
          date: itemForm.date.trim(),
          credentialId: itemForm.credentialId.trim(),
          credentialUrl: itemForm.credentialUrl.trim()
        };
        if (editingItemIndex === null) certifications.push(certification);
        else certifications[editingItemIndex] = { ...certifications[editingItemIndex], ...certification };
        const response = await userAPI.update(userId, { certifications });
        const updatedProfile = { ...currentUser, ...response.data, id: userId };
        delete updatedProfile.password;
        setProfileData(updatedProfile);
        updateUser(updatedProfile);
      }

      setItemFormType('');
      setEditingItemIndex(null);
      setToast({ message: `${itemFormType === 'skill' ? 'Skill' : itemFormType === 'project' ? 'Project' : 'Certificate'} saved successfully`, type: 'success' });
    } catch (err) {
      setItemFormError(err.message || 'Unable to save this item.');
    } finally {
      setSavingItem(false);
    }
  };

  const deleteItem = async (type, index) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      const userId = currentUser.id || currentUser._id;
      if (type === 'skill') {
        const skill = profileSkills[index];
        await skillAPI.delete(skill._id);
        setProfileSkills(previous => previous.filter(item => item._id !== skill._id));
      } else {
        const key = type === 'project' ? 'projects' : 'certifications';
        const values = [...(currentUser[key] || [])];
        values.splice(index, 1);
        const response = await userAPI.update(userId, { [key]: values });
        const updatedProfile = { ...currentUser, ...response.data, id: userId };
        delete updatedProfile.password;
        setProfileData(updatedProfile);
        updateUser(updatedProfile);
      }
      setToast({ message: `${type === 'skill' ? 'Skill' : type === 'project' ? 'Project' : 'Certificate'} deleted successfully`, type: 'success' });
    } catch (err) {
      setToast({ message: err.message || `Unable to delete ${type}.`, type: 'error' });
    }
  };

  return (
    <div className="container">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', marginBottom: '32px' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Error Loading Profile
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>{error}</p>
          <button onClick={fetchProfile} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700' }}>My Profile</h1>
        <button className="btn btn-primary" onClick={openEditForm}>
          <Edit size={18} />
          Edit Profile
        </button>
      </div>

      <div className="grid profile-layout" style={{ gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Left Column - Profile Card */}
        <div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '120px', margin: '0 auto 24px' }}>
              <button
                type="button"
                aria-label="Change profile photo"
                title="Change profile photo"
                onClick={openPhotoPicker}
                style={{ display: 'inline-block', position: 'relative', cursor: 'pointer', borderRadius: '50%', padding: 0, border: 0, background: 'transparent' }}
              >
                <img
                  src={currentUser?.profileImage || DEFAULT_AVATAR}
                  alt={currentUser?.name || 'User'}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = DEFAULT_AVATAR;
                  }}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <span aria-hidden="true" style={{
                  position: 'absolute',
                  right: '0',
                  bottom: '0',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  background: 'var(--primary)',
                  border: '3px solid white',
                  borderRadius: '50%'
                }}>
                  <Camera size={16} />
                </span>
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                aria-label="Select a profile photo"
                onChange={handlePhotoSelection}
                style={{ display: 'none' }}
              />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              {currentUser?.name || 'User'}
            </h2>
            <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
              {currentUser?.branch || 'Student'} Student
            </p>

            <div style={{ textAlign: 'left', borderTop: '1px solid var(--gray-light)', paddingTop: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Mail size={18} color="var(--gray)" />
                  <span style={{ fontSize: '14px', color: 'var(--gray)' }}>Email</span>
                </div>
                <p style={{ fontSize: '15px', marginLeft: '30px', margin: 0 }}>{currentUser?.email || 'Not provided'}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Phone size={18} color="var(--gray)" />
                  <span style={{ fontSize: '14px', color: 'var(--gray)' }}>Phone</span>
                </div>
                <p style={{ fontSize: '15px', marginLeft: '30px', margin: 0 }}>{currentUser?.phone || 'Not provided'}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <MapPin size={18} color="var(--gray)" />
                  <span style={{ fontSize: '14px', color: 'var(--gray)' }}>College</span>
                </div>
                <p style={{ fontSize: '15px', marginLeft: '30px', margin: 0 }}>{currentUser?.college || 'Not provided'}</p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Calendar size={18} color="var(--gray)" />
                  <span style={{ fontSize: '14px', color: 'var(--gray)' }}>Graduation Year</span>
                </div>
                <p style={{ fontSize: '15px', marginLeft: '30px', margin: 0 }}>{currentUser?.graduationYear || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          {/* About */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>About Me</h3>
            <p style={{ color: 'var(--gray)', lineHeight: '1.7' }}>
              {currentUser?.bio || 'No bio added yet'}
            </p>
          </div>

          {/* Education */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Education</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#e0e7ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Award size={24} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                  {currentUser?.degree || 'Not provided'}
                </h4>
                <p style={{ color: 'var(--gray)', marginBottom: '4px' }}>{currentUser?.college || 'Not provided'}</p>
                <p style={{ fontSize: '14px', color: 'var(--gray)' }}>
                  {currentUser?.branch || 'Not specified'} • Class of {currentUser?.graduationYear || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <SectionHeading title="Skills" onAdd={() => openItemForm('skill')} />
            {profileSkills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {profileSkills.map((skill, index) => (
                  <div key={skill._id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '13px', padding: '8px 12px' }}>
                      {skill.name} · {skill.level >= 80 ? 'Advanced' : skill.level >= 60 ? 'Intermediate' : 'Beginner'}
                    </span>
                    <button type="button" title={`Edit ${skill.name}`} aria-label={`Edit ${skill.name}`} onClick={() => openItemForm('skill', skill, index)} style={smallIconButtonStyle}>
                      <Pencil size={14} />
                    </button>
                    <button type="button" title={`Delete ${skill.name}`} aria-label={`Delete ${skill.name}`} onClick={() => deleteItem('skill', index)} style={{ ...smallIconButtonStyle, color: 'var(--danger)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--gray)' }}>No skills added yet. Add a skill to showcase your expertise.</p>
            )}
          </div>

          {/* Projects */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <SectionHeading title="Projects" onAdd={() => openItemForm('project')} />
            {currentUser?.projects && currentUser.projects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {currentUser.projects.map((project, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{project.title}</h4>
                        {isValidHttpUrl(project.link) && project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                            <ExternalLink size={18} />
                          </a>
                        )}
                        {isValidHttpUrl(project.githubUrl) && project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} GitHub`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button type="button" title="Edit project" aria-label={`Edit ${project.title}`} onClick={() => openItemForm('project', project, index)} style={smallIconButtonStyle}>
                          <Pencil size={15} />
                        </button>
                        <button type="button" title="Delete project" aria-label={`Delete ${project.title}`} onClick={() => deleteItem('project', index)} style={{ ...smallIconButtonStyle, color: 'var(--danger)' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '12px', lineHeight: '1.6' }}>
                      {project.description}
                    </p>
                    {(project.startDate || project.endDate) && (
                      <p style={{ color: 'var(--gray)', fontSize: '12px', marginBottom: '8px' }}>
                        {project.startDate || 'Start date not set'} – {project.endDate || 'Present'}
                      </p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(project.technologies || []).map((tech) => (
                        <span key={tech} className="badge badge-info" style={{ fontSize: '11px' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--gray)' }}>No projects added yet</p>
            )}
          </div>

          {/* Certifications */}
          <div className="card">
            <SectionHeading title="Certificates" onAdd={() => openItemForm('certificate')} />
            {currentUser?.certifications && currentUser.certifications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentUser.certifications.map((cert, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '16px',
                      background: 'var(--light)',
                      borderRadius: '8px'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: '#e0e7ff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Award size={20} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                        {isValidHttpUrl(cert.credentialUrl) && cert.credentialUrl
                          ? <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{cert.name}</a>
                          : cert.name}
                      </h4>
                      <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '4px' }}>
                        {cert.issuer}
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--gray)' }}>
                        {cert.date || 'Issue date not provided'}{cert.credentialId ? ` • ID: ${cert.credentialId}` : ''}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button type="button" title="Edit certificate" aria-label={`Edit ${cert.name}`} onClick={() => openItemForm('certificate', cert, index)} style={smallIconButtonStyle}>
                        <Pencil size={15} />
                      </button>
                      <button type="button" title="Delete certificate" aria-label={`Delete ${cert.name}`} onClick={() => deleteItem('certificate', index)} style={{ ...smallIconButtonStyle, color: 'var(--danger)' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--gray)' }}>No certifications added yet</p>
            )}
          </div>
        </div>
      </div>

      {itemFormType && (
        <div className="modal-backdrop" style={modalBackdropStyle} onClick={(event) => {
          if (event.target === event.currentTarget) closeItemForm();
        }}>
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-item-title"
            className="card"
            onSubmit={saveItem}
            style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 id="profile-item-title" style={{ fontSize: '24px', marginBottom: '20px' }}>
              {editingItemIndex === null ? 'Add' : 'Edit'} {itemFormType === 'skill' ? 'Skill' : itemFormType === 'project' ? 'Project' : 'Certificate'}
            </h2>
            {itemFormError && <p role="alert" style={formErrorStyle}>{itemFormError}</p>}
            {itemFormType === 'skill' ? (
              <>
                <label style={formLabelStyle}>
                  Skill name *
                  <input className="input" required value={itemForm.name || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, name: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
                <label style={formLabelStyle}>
                  Category *
                  <input className="input" required value={itemForm.category || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, category: event.target.value }))} placeholder="e.g. Frontend, Backend, Data" style={{ marginTop: '6px' }} />
                </label>
                <label style={formLabelStyle}>
                  Proficiency
                  <select className="input" value={itemForm.proficiency || 'beginner'} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, proficiency: event.target.value }))} style={{ marginTop: '6px' }}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </label>
              </>
            ) : itemFormType === 'project' ? (
              <>
                <label style={formLabelStyle}>
                  Project title *
                  <input className="input" required value={itemForm.title || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, title: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
                <label style={formLabelStyle}>
                  Description *
                  <textarea className="input" required rows={3} value={itemForm.description || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, description: event.target.value }))} style={{ marginTop: '6px', resize: 'vertical' }} />
                </label>
                <label style={formLabelStyle}>
                  Technologies (comma separated)
                  <input className="input" value={itemForm.technologies || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, technologies: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
                <label style={formLabelStyle}>
                  Project URL
                  <input className="input" type="url" value={itemForm.link || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, link: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
                <label style={formLabelStyle}>
                  GitHub URL
                  <input className="input" type="url" value={itemForm.githubUrl || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, githubUrl: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
                <div className="grid grid-2">
                  <label style={formLabelStyle}>
                    Start date
                    <input className="input" type="date" value={itemForm.startDate || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, startDate: event.target.value }))} style={{ marginTop: '6px' }} />
                  </label>
                  <label style={formLabelStyle}>
                    End date
                    <input className="input" type="date" value={itemForm.endDate || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, endDate: event.target.value }))} style={{ marginTop: '6px' }} />
                  </label>
                </div>
              </>
            ) : (
              <>
                <label style={formLabelStyle}>
                  Certificate name *
                  <input className="input" required value={itemForm.name || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, name: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
                <label style={formLabelStyle}>
                  Issuing organization *
                  <input className="input" required value={itemForm.issuer || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, issuer: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
                <label style={formLabelStyle}>
                  Issue date
                  <input className="input" type="date" value={itemForm.date || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, date: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
                <label style={formLabelStyle}>
                  Credential ID
                  <input className="input" value={itemForm.credentialId || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, credentialId: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
                <label style={formLabelStyle}>
                  Credential URL
                  <input className="input" type="url" value={itemForm.credentialUrl || ''} disabled={savingItem} onChange={event => setItemForm(prev => ({ ...prev, credentialUrl: event.target.value }))} style={{ marginTop: '6px' }} />
                </label>
              </>
            )}
            <div style={modalActionsStyle}>
              <button type="button" className="btn btn-secondary" disabled={savingItem} onClick={closeItemForm}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={savingItem}>
                {savingItem ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                {savingItem ? 'Saving...' : `Save ${itemFormType === 'skill' ? 'Skill' : itemFormType === 'project' ? 'Project' : 'Certificate'}`}
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditForm && profileForm && (
        <div className="modal-backdrop" style={modalBackdropStyle} onClick={(event) => {
          if (event.target === event.currentTarget && !savingProfile) setShowEditForm(false);
        }}>
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="card"
            onSubmit={handleSaveProfile}
            style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 id="edit-profile-title" style={{ fontSize: '24px', marginBottom: '20px' }}>Edit Profile</h2>
            {profileFormError && <p role="alert" style={formErrorStyle}>{profileFormError}</p>}
            {[
              ['name', 'Full name', 'text'],
              ['phone', 'Phone number', 'tel'],
              ['college', 'College', 'text'],
              ['degree', 'Degree', 'text'],
              ['branch', 'Branch', 'text'],
              ['graduationYear', 'Graduation year', 'number']
            ].map(([field, label, type]) => (
              <label key={field} style={formLabelStyle}>
                {label}{field === 'name' ? ' *' : ''}
                <input
                  className="input"
                  type={type}
                  value={profileForm[field]}
                  required={field === 'name'}
                  min={type === 'number' ? 1900 : undefined}
                  max={type === 'number' ? 2200 : undefined}
                  disabled={savingProfile}
                  onChange={(event) => setProfileForm(prev => ({ ...prev, [field]: event.target.value }))}
                  style={{ marginTop: '6px' }}
                />
              </label>
            ))}
            <label style={formLabelStyle}>
              Bio
              <textarea
                className="input"
                rows={4}
                value={profileForm.bio}
                disabled={savingProfile}
                onChange={(event) => setProfileForm(prev => ({ ...prev, bio: event.target.value }))}
                style={{ marginTop: '6px', resize: 'vertical' }}
              />
            </label>
            <div style={modalActionsStyle}>
              <button type="button" className="btn btn-secondary" disabled={savingProfile} onClick={() => setShowEditForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                {savingProfile ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showPhotoForm && (
        <div className="modal-backdrop" style={modalBackdropStyle} onClick={(event) => {
          if (event.target === event.currentTarget) closePhotoForm();
        }}>
          <div role="dialog" aria-modal="true" aria-labelledby="change-photo-title" className="card" style={{ width: '100%', maxWidth: '480px' }}>
            <h2 id="change-photo-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Change Profile Photo</h2>
            <p style={{ color: 'var(--gray)', marginBottom: '20px' }}>JPG, JPEG, PNG, or WEBP. Maximum size: 5 MB.</p>
            {photoError && <p role="alert" style={formErrorStyle}>{photoError}</p>}
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Selected profile photo preview"
                style={{ display: 'block', width: '160px', height: '160px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto 20px' }}
              />
            ) : <p style={{ color: 'var(--gray)', marginBottom: '20px' }}>Select an image using the profile picture or camera icon.</p>}
            {photoPreview && (
              <button type="button" className="btn btn-secondary" onClick={openPhotoPicker} style={{ display: 'flex', width: '100%', marginBottom: '20px' }}>
                Choose a different image
              </button>
            )}
            <div style={modalActionsStyle}>
              <button type="button" className="btn btn-secondary" disabled={savingPhoto} onClick={closePhotoForm}>Cancel</button>
              <button type="button" className="btn btn-primary" disabled={!photoPreview || savingPhoto} onClick={handleSavePhoto}>
                {savingPhoto ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                {savingPhoto ? 'Uploading...' : 'Confirm Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SectionHeading = ({ title, onAdd }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{title}</h3>
    <button type="button" className="btn btn-secondary btn-sm" onClick={onAdd}>
      <Plus size={15} />
      Add {title === 'Certificates' ? 'Certificate' : title.slice(0, -1)}
    </button>
  </div>
);

const modalBackdropStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 2000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: 'rgba(15, 23, 42, 0.55)'
};

const formLabelStyle = {
  display: 'block',
  fontWeight: '600',
  marginBottom: '16px'
};

const formErrorStyle = {
  color: 'var(--danger)',
  background: '#fee2e2',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '16px'
};

const modalActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '8px'
};

const smallIconButtonStyle = {
  padding: '6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--primary)',
  background: 'transparent',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default Profile;
