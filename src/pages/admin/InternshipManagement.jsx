import { useState, useEffect, useCallback } from 'react';
import { internshipAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle } from 'lucide-react';
import Toast from '../../components/Toast';
import '../../styles/global.css';

const InternshipManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || user?._id;
  const isAdmin = user?.role === 'admin';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [internships, setInternships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogo: '',
    description: '',
    responsibilities: '',
    requiredSkills: '',
    preferredSkills: '',
    location: '',
    workMode: 'On-site',
    duration: '',
    stipend: '',
    stipendAmount: '',
    applicationDeadline: '',
    openings: '',
    category: 'Engineering'
  });

  const fetchInternships = useCallback(async () => {
    try {
      setLoading(true);
      const response = await internshipAPI.getAll({ limit: 50 });
      setInternships(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch internships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchInternships();
  }, [isAdmin, userId, navigate, fetchInternships]);

  const handleOpenModal = (internship = null) => {
    if (internship) {
      setEditingInternship(internship);
      setFormData({
        title: internship.title,
        company: internship.company,
        companyLogo: internship.companyLogo || '',
        description: internship.description,
        responsibilities: internship.responsibilities?.join('\n') || '',
        requiredSkills: internship.requiredSkills?.join(', ') || '',
        preferredSkills: internship.preferredSkills?.join(', ') || '',
        location: internship.location,
        workMode: internship.workMode,
        duration: internship.duration,
        stipend: internship.stipend,
        stipendAmount: internship.stipendAmount || '',
        applicationDeadline: internship.applicationDeadline ? new Date(internship.applicationDeadline).toISOString().split('T')[0] : '',
        openings: internship.openings || '',
        category: internship.category
      });
    } else {
      setEditingInternship(null);
      setFormData({
        title: '',
        company: '',
        companyLogo: '',
        description: '',
        responsibilities: '',
        requiredSkills: '',
        preferredSkills: '',
        location: '',
        workMode: 'On-site',
        duration: '',
        stipend: '',
        stipendAmount: '',
        applicationDeadline: '',
        openings: '',
        category: 'Engineering'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInternship(null);
    setFormData({
      title: '',
      company: '',
      companyLogo: '',
      description: '',
      responsibilities: '',
      requiredSkills: '',
      preferredSkills: '',
      location: '',
      workMode: 'On-site',
      duration: '',
      stipend: '',
      stipendAmount: '',
      applicationDeadline: '',
      openings: '',
      category: 'Engineering'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(s => s),
        stipendAmount: formData.stipendAmount ? parseInt(formData.stipendAmount) : 0,
        openings: formData.openings ? parseInt(formData.openings) : 1
      };

      if (editingInternship) {
        await internshipAPI.update(editingInternship._id, data);
        setToast({ message: 'Internship updated successfully', type: 'success' });
      } else {
        await internshipAPI.create(data);
        setToast({ message: 'Internship created successfully', type: 'success' });
      }

      handleCloseModal();
      fetchInternships();
    } catch (err) {
      setToast({ message: err.message || 'Failed to save internship', type: 'error' });
    }
  };

  const handleDelete = async (internshipId) => {
    if (!window.confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
      return;
    }

    setDeletingId(internshipId);
    try {
      await internshipAPI.delete(internshipId);
      setInternships(prev => prev.filter(i => i._id !== internshipId));
      setToast({ message: 'Internship deleted successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete internship', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>Loading internships...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
            Internship Management
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
            Create and manage internship listings
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={18} />
          Create Internship
        </button>
      </div>

      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', marginBottom: '32px' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Error Loading Internships
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>{error}</p>
          <button onClick={fetchInternships} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && internships.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <Search size={64} color="var(--gray)" style={{ marginBottom: '24px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            No Internships Found
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
            Create your first internship listing to get started
          </p>
        </div>
      )}

      {!loading && !error && internships.length > 0 && (
        <div className="grid grid-2" style={{ gap: '24px' }}>
          {internships.map((internship) => (
            <div key={internship._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <img
                  src={internship.companyLogo || internship.logo || 'https://via.placeholder.com/48'}
                  alt={internship.company}
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                    {internship.title}
                  </h3>
                  <p style={{ color: 'var(--gray)', fontSize: '14px', margin: 0 }}>
                    {internship.company}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '8px' }}>
                  {internship.location} • {internship.workMode} • {internship.duration}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--gray)', margin: 0 }}>
                  {internship.stipend} • {internship.openings} openings
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleOpenModal(internship)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(internship._id)}
                  disabled={deletingId === internship._id}
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1, opacity: deletingId === internship._id ? 0.6 : 1 }}
                >
                  {deletingId === internship._id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
              {editingInternship ? 'Edit Internship' : 'Create Internship'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Company *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Company Logo URL
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.companyLogo}
                    onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Description *
                  </label>
                  <textarea
                    className="input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Responsibilities (one per line)
                  </label>
                  <textarea
                    className="input"
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Required Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Preferred Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.preferredSkills}
                    onChange={(e) => setFormData({ ...formData, preferredSkills: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Work Mode *
                  </label>
                  <select
                    className="input"
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    required
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Duration *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Stipend *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Stipend Amount (numeric)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={formData.stipendAmount}
                    onChange={(e) => setFormData({ ...formData, stipendAmount: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.applicationDeadline}
                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Openings
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={formData.openings}
                    onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>
                    Category *
                  </label>
                  <select
                    className="input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingInternship ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipManagement;
