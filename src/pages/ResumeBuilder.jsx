import { useState, useEffect, useRef, useCallback } from 'react';

import { getCurrentUser, userAPI } from '../services/api';

import { useAuth } from '../context/AuthContext';

import { Plus, Trash2, Download, Eye, User as UserIcon, GraduationCap, Briefcase, Award, Code, Loader2, AlertCircle, Save, ChevronUp, ChevronDown, Globe, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';

import Toast from '../components/Toast';

import '../styles/global.css';



const TEMPLATES = [

  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },

  { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },

  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' }

];

const createResumeData = (userData) => ({
  summary: userData.resume?.summary || userData.bio || '',
  location: userData.resume?.location || '',
  linkedin: userData.resume?.linkedin || '',
  github: userData.resume?.github || '',
  portfolio: userData.resume?.portfolio || '',
  education: userData.resume?.education || [],
  experience: userData.resume?.experience || [],
  skills: userData.resume?.skills || [],
  achievements: userData.resume?.achievements || [],
  languages: userData.resume?.languages || []
});

const isValidResumeLink = (value) => {
  if (!value.trim()) return true;
  const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};


const ResumeBuilder = () => {

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const downloadPending = useRef(false);

  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const [expandedSection, setExpandedSection] = useState('personal');



  const [resumeData, setResumeData] = useState({

    summary: '',

    location: '',

    linkedin: '',

    github: '',

    portfolio: '',

    education: [],

    experience: [],

    skills: [],

    achievements: [],

    languages: []

  });



  const previewRef = useRef(null);

  const fetchUserData = useCallback(async () => {
    const response = await getCurrentUser();
    return response.user;
  }, []);

  const handleRetryLoad = async () => {
    setLoading(true);
    try {
      const userData = await fetchUserData();
      setResumeData(createResumeData(userData));
      setError('');
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        if (!cancelled) {
          setResumeData(createResumeData(userData));
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load user data');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadUserData();
    return () => {
      cancelled = true;
    };
  }, [user, fetchUserData]);



  const handleSave = async () => {
    const invalidLink = [
      ['LinkedIn', resumeData.linkedin],
      ['GitHub', resumeData.github],
      ['Portfolio', resumeData.portfolio]
    ].find(([, value]) => !isValidResumeLink(value));

    if (invalidLink) {
      setToast({ message: `Enter a valid URL for ${invalidLink[0]}.`, type: 'error' });
      return;
    }

    try {

      setSaving(true);

      await userAPI.updateResume(resumeData);

      setToast({ message: 'Resume saved successfully', type: 'success' });

    } catch (err) {

      setToast({ message: err.message || 'Failed to save resume', type: 'error' });

    } finally {

      setSaving(false);

    }

  };



  const downloadPDF = useCallback(async (element) => {
    const opt = {
      margin: 0,
      filename: `${user?.name || 'resume'}.pdf`,

      image: { type: 'jpeg', quality: 0.98 },

      html2canvas: { scale: 2 },

      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      const html2pdf = await import('html2pdf.js');
      await html2pdf.default().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to download resume', type: 'error' });
    }
  }, [user?.name]);

  const handleDownloadPDF = () => {
    if (!previewRef.current) {
      downloadPending.current = true;
      setShowPreview(true);
      return;
    }

    downloadPDF(previewRef.current);
  };



  const addItem = (section) => {

    const newItem = getEmptyItem(section);

    setResumeData(prev => ({

      ...prev,

      [section]: [...prev[section], newItem]

    }));

  };



  const removeItem = (section, index) => {

    setResumeData(prev => ({

      ...prev,

      [section]: prev[section].filter((_, i) => i !== index)

    }));

  };



  const updateItem = (section, index, field, value) => {

    setResumeData(prev => ({

      ...prev,

      [section]: prev[section].map((item, i) =>
        i === index
          ? field === null
            ? value
            : { ...item, [field]: value }
          : item
      )

    }));

  };



  const moveItem = (section, fromIndex, toIndex) => {

    setResumeData(prev => {

      const items = [...prev[section]];

      const [movedItem] = items.splice(fromIndex, 1);

      items.splice(toIndex, 0, movedItem);

      return { ...prev, [section]: items };

    });

  };



  const getEmptyItem = (section) => {

    switch (section) {

      case 'education':

        return { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' };

      case 'experience':

        return { company: '', position: '', startDate: '', endDate: '', description: '', current: false };

      case 'skills':

        return '';

      case 'achievements':

        return '';

      case 'languages':

        return '';

      default:

        return {};

    }

  };



  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    if (!downloadPending.current || !showPreview || !previewRef.current) return;

    downloadPending.current = false;
    downloadPDF(previewRef.current);
  }, [showPreview, downloadPDF]);



  if (loading) {

    return (

      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>

        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />

        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>Loading resume data...</p>

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

            Resume Builder

          </h1>

          <p style={{ color: 'var(--gray)', fontSize: '18px' }}>

            Create and customize your professional resume

          </p>

        </div>

        <div style={{ display: 'flex', gap: '12px' }}>

          <button

            onClick={() => setShowPreview(!showPreview)}

            className="btn btn-secondary"
            disabled={Boolean(error)}

          >

            <Eye size={18} />

            {showPreview ? 'Hide Preview' : 'Live Preview'}

          </button>

          <button

            onClick={handleSave}
            disabled={saving || Boolean(error)}

            className="btn btn-primary"

            style={{ opacity: saving || error ? 0.6 : 1 }}

          >

            {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}

            {saving ? 'Saving...' : 'Save Resume'}

          </button>

          <button

            onClick={handleDownloadPDF}

            className="btn btn-primary"
            disabled={Boolean(error)}

          >

            <Download size={18} />

            Download PDF

          </button>

        </div>

      </div>



      {error && (

        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', marginBottom: '32px' }}>

          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />

          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>

            Error Loading Data

          </h3>

          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>{error}</p>

          <button onClick={handleRetryLoad} className="btn btn-primary">

            Try Again

          </button>

        </div>

      )}



      {!error && (
      <div className={`grid resume-builder-grid${showPreview ? ' resume-preview-visible' : ''}`}>

        {/* Editor Section */}

        <div>

          {/* Template Selection */}

          <div className="card" style={{ marginBottom: '24px' }}>

            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>

              Select Template

            </h3>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

              {TEMPLATES.map(template => (

                <button

                  key={template.id}

                  onClick={() => setSelectedTemplate(template.id)}

                  className="btn"

                  style={{

                    flex: 1,

                    minWidth: '150px',

                    background: selectedTemplate === template.id ? 'var(--primary)' : 'var(--white)',

                    color: selectedTemplate === template.id ? 'var(--white)' : 'var(--dark)',

                    border: selectedTemplate === template.id ? 'none' : '2px solid var(--gray-light)'

                  }}

                >

                  {template.name}

                </button>

              ))}

            </div>
          </div>



          {/* Personal Information */}

          <Section

            title="Personal Information"

            icon={<UserIcon size={20} color="var(--primary)" />}

            expanded={expandedSection === 'personal'}

            onToggle={() => toggleSection('personal')}

          >

            <div className="resume-personal-grid">

              <div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>

                  Professional Summary

                </label>

                <textarea

                  className="input"

                  value={resumeData.summary}

                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}

                  rows={4}

                  placeholder="Brief professional summary..."

                />

              </div>

              <div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>

                  Location

                </label>

                <input

                  type="text"

                  className="input"

                  value={resumeData.location}

                  onChange={(e) => setResumeData(prev => ({ ...prev, location: e.target.value }))}

                  placeholder="City, State, Country"

                />

              </div>

              <div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>

                  LinkedIn

                </label>

                <input

                  type="text"

                  className="input"

                  value={resumeData.linkedin}

                  onChange={(e) => setResumeData(prev => ({ ...prev, linkedin: e.target.value }))}

                  placeholder="linkedin.com/in/username"

                />

              </div>

              <div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>

                  GitHub

                </label>

                <input

                  type="text"

                  className="input"

                  value={resumeData.github}

                  onChange={(e) => setResumeData(prev => ({ ...prev, github: e.target.value }))}

                  placeholder="github.com/username"

                />

              </div>

              <div style={{ gridColumn: '1 / -1' }}>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray)' }}>

                  Portfolio Website

                </label>

                <input

                  type="text"

                  className="input"

                  value={resumeData.portfolio}

                  onChange={(e) => setResumeData(prev => ({ ...prev, portfolio: e.target.value }))}

                  placeholder="yourportfolio.com"

                />

              </div>

            </div>

          </Section>



          {/* Education */}

          <RepeatableSection

            title="Education"

            icon={<GraduationCap size={20} color="var(--primary)" />}

            items={resumeData.education}

            expanded={expandedSection === 'education'}

            onToggle={() => toggleSection('education')}

            onAdd={() => addItem('education')}

            onRemove={(index) => removeItem('education', index)}


            onMove={(from, to) => moveItem('education', from, to)}

            renderItem={(item, index) => (

              <EducationEditor item={item} onChange={(field, value) => updateItem('education', index, field, value)} />

            )}

          />



          {/* Experience */}

          <RepeatableSection

            title="Work Experience"

            icon={<Briefcase size={20} color="var(--primary)" />}

            items={resumeData.experience}

            expanded={expandedSection === 'experience'}

            onToggle={() => toggleSection('experience')}

            onAdd={() => addItem('experience')}

            onRemove={(index) => removeItem('experience', index)}


            onMove={(from, to) => moveItem('experience', from, to)}

            renderItem={(item, index) => (

              <ExperienceEditor item={item} onChange={(field, value) => updateItem('experience', index, field, value)} />

            )}

          />



          {/* Skills */}

          <ArraySection

            title="Technical Skills"

            icon={<Code size={20} color="var(--primary)" />}

            items={resumeData.skills}

            expanded={expandedSection === 'skills'}

            onToggle={() => toggleSection('skills')}

            onAdd={() => addItem('skills')}

            onRemove={(index) => removeItem('skills', index)}

            onUpdate={(index, value) => updateItem('skills', index, null, value)}

            placeholder="Enter a skill (e.g., JavaScript, React, Python)"

          />



          {/* Achievements */}

          <ArraySection

            title="Achievements"

            icon={<Award size={20} color="var(--primary)" />}

            items={resumeData.achievements}

            expanded={expandedSection === 'achievements'}

            onToggle={() => toggleSection('achievements')}

            onAdd={() => addItem('achievements')}

            onRemove={(index) => removeItem('achievements', index)}

            onUpdate={(index, value) => updateItem('achievements', index, null, value)}

            placeholder="Enter an achievement (e.g., Won hackathon 2024)"

          />



          {/* Languages */}

          <ArraySection

            title="Languages"

            icon={<Globe size={20} color="var(--primary)" />}

            items={resumeData.languages}

            expanded={expandedSection === 'languages'}

            onToggle={() => toggleSection('languages')}

            onAdd={() => addItem('languages')}

            onRemove={(index) => removeItem('languages', index)}

            onUpdate={(index, value) => updateItem('languages', index, null, value)}

            placeholder="Enter a language (e.g., English, Spanish)"

          />

        </div>



        {/* Preview Section */}

        {showPreview && (

          <div>

            <div

              ref={previewRef}
              className="resume-preview-sheet"
              style={{
                background: 'white',
                padding: '40px',
                boxShadow: 'var(--shadow-lg)',
                minHeight: '800px'

              }}

            >

              <ResumePreview template={selectedTemplate} resumeData={resumeData} user={user} />

            </div>

          </div>

        )}

      </div>
      )}

    </div>

  );

};



// Helper Components

const Section = ({ title, icon, expanded, onToggle, children }) => (

  <div className="card" style={{ marginBottom: '24px' }}>

    <div

      onClick={onToggle}

      style={{

        display: 'flex',

        justifyContent: 'space-between',

        alignItems: 'center',

        marginBottom: expanded ? '20px' : '0',

        cursor: 'pointer'

      }}

    >

      <h3 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>

        {icon}

        {title}

      </h3>

      {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}

    </div>

    {expanded && children}

  </div>

);



const RepeatableSection = ({ title, icon, items, expanded, onToggle, onAdd, onRemove, onMove, renderItem }) => (

  <Section title={title} icon={icon} expanded={expanded} onToggle={onToggle}>

    {items.length === 0 ? (

      <div style={{ textAlign: 'center', padding: '32px', background: 'var(--light)', borderRadius: '8px', marginBottom: '16px' }}>

        <p style={{ color: 'var(--gray)', marginBottom: '16px' }}>No items added yet</p>

        <button onClick={onAdd} className="btn btn-secondary btn-sm">

          <Plus size={16} />

          Add {title}

        </button>

      </div>

    ) : (

      items.map((item, index) => (

        <div

          key={index}

          style={{

            padding: '20px',

            background: 'var(--light)',

            borderRadius: '8px',

            marginBottom: '16px',

            position: 'relative'

          }}

        >

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>

            <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>

              {title} #{index + 1}

            </h4>

            <div style={{ display: 'flex', gap: '8px' }}>

              {index > 0 && (

                <button

                  onClick={() => onMove(index, index - 1)}

                  className="btn btn-secondary btn-sm"

                  style={{ padding: '6px 12px' }}

                >

                  <ArrowUp size={14} />

                </button>

              )}

              {index < items.length - 1 && (

                <button

                  onClick={() => onMove(index, index + 1)}

                  className="btn btn-secondary btn-sm"

                  style={{ padding: '6px 12px' }}

                >

                  <ArrowDown size={14} />

                </button>

              )}

              <button

                onClick={() => onRemove(index)}

                className="btn btn-danger btn-sm"

                style={{ padding: '6px 12px' }}

              >

                <Trash2 size={14} />

              </button>

            </div>

          </div>

          {renderItem(item, index)}

        </div>

      ))

    )}

    <button onClick={onAdd} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>

      <Plus size={16} />

      Add Another {title.slice(0, -1)}

    </button>

  </Section>

);



const ArraySection = ({ title, icon, items, expanded, onToggle, onAdd, onRemove, onUpdate, placeholder }) => (

  <Section title={title} icon={icon} expanded={expanded} onToggle={onToggle}>

    {items.length === 0 ? (

      <div style={{ textAlign: 'center', padding: '32px', background: 'var(--light)', borderRadius: '8px', marginBottom: '16px' }}>

        <p style={{ color: 'var(--gray)', marginBottom: '16px' }}>No items added yet</p>

        <button onClick={onAdd} className="btn btn-secondary btn-sm">

          <Plus size={16} />

          Add {title}

        </button>

      </div>

    ) : (

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {items.map((item, index) => (

          <div key={index} style={{ display: 'flex', gap: '8px' }}>

            <input

              type="text"

              className="input"

              value={item}

              onChange={(e) => onUpdate(index, e.target.value)}

              placeholder={placeholder}

              style={{ flex: 1 }}

            />

            <button

              onClick={() => onRemove(index)}

              className="btn btn-danger btn-sm"

              style={{ padding: '8px 12px' }}

            >

              <Trash2 size={14} />

            </button>

          </div>

        ))}

      </div>

    )}

    <button onClick={onAdd} className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '12px' }}>

      <Plus size={16} />

      Add Another

    </button>

  </Section>

);



const EducationEditor = ({ item, onChange }) => (

  <div className="resume-form-grid">

    <div style={{ gridColumn: '1 / -1' }}>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        Institution

      </label>

      <input

        type="text"

        className="input"

        value={item.institution}

        onChange={(e) => onChange('institution', e.target.value)}

        placeholder="University Name"

      />

    </div>

    <div>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        Degree

      </label>

      <input

        type="text"

        className="input"

        value={item.degree}

        onChange={(e) => onChange('degree', e.target.value)}

        placeholder="Bachelor of Science"

      />

    </div>

    <div>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        Field of Study

      </label>

      <input

        type="text"

        className="input"

        value={item.field}

        onChange={(e) => onChange('field', e.target.value)}

        placeholder="Computer Science"

      />

    </div>

    <div>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        Start Date

      </label>

      <input

        type="text"

        className="input"

        value={item.startDate}

        onChange={(e) => onChange('startDate', e.target.value)}

        placeholder="September 2020"

      />

    </div>

    <div>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        End Date

      </label>

      <input

        type="text"

        className="input"

        value={item.endDate}

        onChange={(e) => onChange('endDate', e.target.value)}

        placeholder="May 2024"

      />

    </div>

    <div style={{ gridColumn: '1 / -1' }}>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        GPA (Optional)

      </label>

      <input

        type="text"

        className="input"

        value={item.gpa}

        onChange={(e) => onChange('gpa', e.target.value)}

        placeholder="3.8/4.0"

      />

    </div>

  </div>

);



const ExperienceEditor = ({ item, onChange }) => (

  <div className="resume-form-grid">

    <div style={{ gridColumn: '1 / -1' }}>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        Company

      </label>

      <input

        type="text"

        className="input"

        value={item.company}

        onChange={(e) => onChange('company', e.target.value)}

        placeholder="Company Name"

      />

    </div>

    <div>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        Position

      </label>

      <input

        type="text"

        className="input"

        value={item.position}

        onChange={(e) => onChange('position', e.target.value)}

        placeholder="Software Engineer"

      />

    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

      <input

        type="checkbox"

        checked={item.current}

        onChange={(e) => onChange('current', e.target.checked)}

        id={`current-${item.company}`}

      />

      <label htmlFor={`current-${item.company}`} style={{ fontSize: '13px', color: 'var(--gray)' }}>

        Current Position

      </label>

    </div>

    <div>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        Start Date

      </label>

      <input

        type="text"

        className="input"

        value={item.startDate}

        onChange={(e) => onChange('startDate', e.target.value)}

        placeholder="June 2023"

      />

    </div>

    <div>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        End Date

      </label>

      <input

        type="text"

        className="input"

        value={item.endDate}

        onChange={(e) => onChange('endDate', e.target.value)}

        placeholder={item.current ? 'Present' : 'December 2023'}

        disabled={item.current}

      />

    </div>

    <div style={{ gridColumn: '1 / -1' }}>

      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--gray)' }}>

        Description

      </label>

      <textarea

        className="input"

        value={item.description}

        onChange={(e) => onChange('description', e.target.value)}

        rows={3}

        placeholder="Describe your responsibilities and achievements..."

      />

    </div>

  </div>

);



const ResumePreview = ({ template, resumeData, user }) => {

  const userData = user || {};



  const styles = {

    modern: {

      headerBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',

      headerColor: 'white',

      titleColor: '#6366f1',

      borderBottom: '2px solid #6366f1'

    },

    classic: {

      headerBg: '#1e293b',

      headerColor: 'white',

      titleColor: '#1e293b',

      borderBottom: '2px solid #1e293b'

    },

    minimal: {

      headerBg: '#f8fafc',

      headerColor: '#1e293b',

      titleColor: '#1e293b',

      borderBottom: '1px solid #e2e8f0'

    }

  };



  const style = styles[template] || styles.modern;



  return (

    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>

      {/* Header */}

      <div style={{ background: style.headerBg, color: style.headerColor, padding: '30px', marginBottom: '30px' }}>

        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>

          {userData.name || 'Your Name'}

        </h1>

        <p style={{ fontSize: '14px', margin: '0 0 12px 0', opacity: 0.9 }}>

          {userData.email || 'your.email@example.com'}

        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>

          {resumeData.location && <span>{resumeData.location}</span>}

          {userData.phone && <span>{userData.phone}</span>}

          {resumeData.linkedin && (

            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

<ExternalLink size={14} /> {resumeData.linkedin}

            </span>

          )}

          {resumeData.github && (

            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

              <Code size={14} /> {resumeData.github}

            </span>

          )}

          {resumeData.portfolio && (

            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

              <Globe size={14} /> {resumeData.portfolio}

            </span>

          )}

        </div>

      </div>



      {/* Summary */}

      {resumeData.summary && (

        <div style={{ marginBottom: '24px' }}>

          <h2 style={{ color: style.titleColor, fontSize: '18px', fontWeight: '700', marginBottom: '12px', borderBottom: style.borderBottom, paddingBottom: '8px' }}>

            Professional Summary

          </h2>

          <p style={{ fontSize: '14px', color: '#475569' }}>{resumeData.summary}</p>

        </div>

      )}



      {/* Education */}

      {resumeData.education.length > 0 && (

        <div style={{ marginBottom: '24px' }}>

          <h2 style={{ color: style.titleColor, fontSize: '18px', fontWeight: '700', marginBottom: '12px', borderBottom: style.borderBottom, paddingBottom: '8px' }}>

            Education

          </h2>

          {resumeData.education.map((edu, index) => (

            <div key={index} style={{ marginBottom: '16px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>

                <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>

                  {edu.institution}

                </h3>

                <span style={{ fontSize: '13px', color: '#64748b' }}>

                  {edu.startDate} - {edu.endDate}

                </span>

              </div>

              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 4px' }}>

                {edu.degree} in {edu.field}

              </p>

              {edu.gpa && <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>GPA: {edu.gpa}</p>}

            </div>

          ))}

        </div>

      )}



      {/* Experience */}

      {resumeData.experience.length > 0 && (

        <div style={{ marginBottom: '24px' }}>

          <h2 style={{ color: style.titleColor, fontSize: '18px', fontWeight: '700', marginBottom: '12px', borderBottom: style.borderBottom, paddingBottom: '8px' }}>

            Work Experience

          </h2>

          {resumeData.experience.map((exp, index) => (

            <div key={index} style={{ marginBottom: '16px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>

                <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>

                  {exp.position}

                </h3>

                <span style={{ fontSize: '13px', color: '#64748b' }}>

                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}

                </span>

              </div>

              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px' }}>

                {exp.company}

              </p>

              {exp.description && (

                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>

                  {exp.description}

                </p>

              )}

            </div>

          ))}

        </div>

      )}



      {/* Skills */}

      {resumeData.skills.length > 0 && (

        <div style={{ marginBottom: '24px' }}>

          <h2 style={{ color: style.titleColor, fontSize: '18px', fontWeight: '700', marginBottom: '12px', borderBottom: style.borderBottom, paddingBottom: '8px' }}>

            Technical Skills

          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>

            {resumeData.skills.map((skill, index) => (

              <span

                key={index}

                style={{

                  fontSize: '13px',

                  padding: '6px 12px',

                  background: '#e0e7ff',

                  color: '#3730a3',

                  borderRadius: '4px',

                  fontWeight: '500'

                }}

              >

                {skill}

              </span>

            ))}

          </div>

        </div>

      )}



      {/* Achievements */}

      {resumeData.achievements.length > 0 && (

        <div style={{ marginBottom: '24px' }}>

          <h2 style={{ color: style.titleColor, fontSize: '18px', fontWeight: '700', marginBottom: '12px', borderBottom: style.borderBottom, paddingBottom: '8px' }}>

            Achievements

          </h2>

          <ul style={{ paddingLeft: '20px', margin: 0 }}>

            {resumeData.achievements.map((achievement, index) => (

              <li key={index} style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>

                {achievement}

              </li>

            ))}

          </ul>

        </div>

      )}



      {/* Languages */}

      {resumeData.languages.length > 0 && (

        <div style={{ marginBottom: '24px' }}>

          <h2 style={{ color: style.titleColor, fontSize: '18px', fontWeight: '700', marginBottom: '12px', borderBottom: style.borderBottom, paddingBottom: '8px' }}>

            Languages

          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>

            {resumeData.languages.map((language, index) => (

              <span key={index} style={{ fontSize: '14px', color: '#475569' }}>

                {language}

              </span>

            ))}

          </div>

        </div>

      )}

    </div>

  );

};



export default ResumeBuilder;
