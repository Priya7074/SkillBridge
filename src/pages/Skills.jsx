import { useState, useEffect } from 'react';
import { skillAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import Toast from '../components/Toast';
import '../styles/global.css';

const Skills = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: '',
    proficiency: 'beginner'
  });

  const fetchSkills = async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLoading(true);
      const response = await skillAPI.getAll();
      setSkills(response.data);
      setError('');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to fetch skills');
      console.error(err);
      return false;
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSkills();
  }, [user, navigate]);

  const openAddForm = () => {
    setSkillForm({ name: '', category: '', proficiency: 'beginner' });
    setFormError('');
    setShowAddForm(true);
  };

  const closeAddForm = () => {
    if (saving) return;
    setShowAddForm(false);
    setFormError('');
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
    if (saving) return;

    const name = skillForm.name.trim();
    const category = skillForm.category.trim();
    if (!name || !category) {
      setFormError('Enter both a skill name and category.');
      return;
    }

    const levelByProficiency = {
      beginner: 30,
      intermediate: 60,
      advanced: 90
    };

    try {
      setSaving(true);
      setFormError('');
      await skillAPI.create({
        name,
        category,
        level: levelByProficiency[skillForm.proficiency]
      });
      setShowAddForm(false);
      setToast({ message: 'Skill added successfully', type: 'success' });

      const refreshed = await fetchSkills({ showLoading: false });
      if (!refreshed) {
        setToast({
          message: 'Skill was saved, but the list could not be refreshed. Please reload the page.',
          type: 'error'
        });
      }
    } catch (err) {
      setFormError(err.message || 'Failed to save skill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      await skillAPI.delete(id);
      setSkills(prev => prev.filter(skill => skill._id !== id));
      setToast({ message: 'Skill deleted successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete skill', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>Loading skills...</p>
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
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>My Skills</h1>
          <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
            Manage and showcase your technical skills
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAddForm}>
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', marginBottom: '32px' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Error Loading Skills
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>{error}</p>
          <button onClick={fetchSkills} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && skills.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <TrendingUp size={64} color="var(--gray)" style={{ marginBottom: '24px' }} />
          <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            No Skills Yet
          </h3>
          <p style={{ color: 'var(--gray)', fontSize: '16px', marginBottom: '32px' }}>
            Start adding your technical skills to showcase your expertise
          </p>
          <button type="button" className="btn btn-primary" onClick={openAddForm}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            Add Your First Skill
          </button>
        </div>
      )}

      {!loading && !error && skills.length > 0 && (
        <div className="grid grid-2" style={{ gap: '24px' }}>
          {skills.map((skill) => (
            <div key={skill._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
                    {skill.name}
                  </h3>
                  <span className="badge badge-info">{skill.category}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      padding: '8px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      color: 'var(--primary)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#e0e7ff'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    style={{
                      padding: '8px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      color: 'var(--danger)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--gray)' }}>Proficiency Level</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>
                    {skill.level}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                <TrendingUp size={16} color="var(--success)" />
                <span style={{ fontSize: '13px', color: 'var(--gray)' }}>
                  {skill.level >= 80 ? 'Advanced' : skill.level >= 60 ? 'Intermediate' : 'Beginner'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Card */}
      <div
        className="card"
        style={{
          border: '2px dashed var(--gray-light)',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.background = '#e0e7ff';
        }}
        onClick={openAddForm}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openAddForm();
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--gray-light)';
          e.target.style.background = 'transparent';
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            background: '#e0e7ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Plus size={32} color="var(--primary)" />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--primary)', margin: 0 }}>
          Add New Skill
        </h3>
        <p style={{ color: 'var(--gray)', fontSize: '14px', marginTop: '8px' }}>
          Click to add a new skill to your profile
        </p>
      </div>

      {showAddForm && (
        <div
          onClick={(event) => {
            if (event.target === event.currentTarget) closeAddForm();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'rgba(15, 23, 42, 0.55)'
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-skill-title"
            onSubmit={handleAddSkill}
            className="card"
            style={{ width: '100%', maxWidth: '520px' }}
          >
            <h2 id="add-skill-title" style={{ fontSize: '24px', marginBottom: '20px' }}>
              Add Skill
            </h2>

            {formError && (
              <p role="alert" style={{ color: 'var(--danger)', marginBottom: '16px' }}>
                {formError}
              </p>
            )}

            <label htmlFor="skill-name" style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
              Skill name
            </label>
            <input
              id="skill-name"
              className="input"
              type="text"
              value={skillForm.name}
              onChange={(event) => setSkillForm(prev => ({ ...prev, name: event.target.value }))}
              placeholder="e.g., JavaScript"
              required
              disabled={saving}
              style={{ marginBottom: '16px' }}
            />

            <label htmlFor="skill-category" style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
              Category
            </label>
            <input
              id="skill-category"
              className="input"
              type="text"
              value={skillForm.category}
              onChange={(event) => setSkillForm(prev => ({ ...prev, category: event.target.value }))}
              placeholder="e.g., Programming"
              required
              disabled={saving}
              style={{ marginBottom: '16px' }}
            />

            <label htmlFor="skill-proficiency" style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
              Proficiency level
            </label>
            <select
              id="skill-proficiency"
              className="input"
              value={skillForm.proficiency}
              onChange={(event) => setSkillForm(prev => ({ ...prev, proficiency: event.target.value }))}
              disabled={saving}
              style={{ marginBottom: '24px' }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={closeAddForm} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                {saving ? 'Saving...' : 'Save Skill'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Skills;
