
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Bookmark,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

import {
  internshipAPI,
  savedInternshipAPI,
  applicationAPI
} from '../services/api';

import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import '../styles/global.css';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadInternship = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await internshipAPI.getById(id);

        if (!cancelled) {
          const data = response.data?.internship ?? response.data;
          setInternship(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Internship not found');
          console.error('Failed to fetch internship:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const loadStudentStatus = async () => {
      if (!user) {
        setIsSaved(false);
        setIsApplied(false);
        return;
      }

      try {
        const [savedResponse, applicationResponse] = await Promise.all([
          savedInternshipAPI.getAll(),
          applicationAPI.getAll()
        ]);

        if (cancelled) return;

        const savedItems = savedResponse.data?.savedInternships
          ?? savedResponse.data?.data
          ?? savedResponse.data
          ?? [];

        const applications = applicationResponse.data?.applications
          ?? applicationResponse.data?.data
          ?? applicationResponse.data
          ?? [];

        setIsSaved(
          Array.isArray(savedItems) &&
          savedItems.some(item => {
            const internshipId =
              item.internshipId?._id ?? item.internshipId;

            return String(internshipId) === String(id);
          })
        );

        setIsApplied(
          Array.isArray(applications) &&
          applications.some(item => {
            const internshipId =
              item.internshipId?._id ?? item.internshipId;

            return String(internshipId) === String(id);
          })
        );
      } catch (err) {
        console.error('Failed to load application/save status:', err);
      }
    };

    loadInternship();
    loadStudentStatus();

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!internship?._id) return;

    setSaving(true);

    try {
      if (isSaved) {
        const response = await savedInternshipAPI.getAll();

        const savedItems = response.data?.savedInternships
          ?? response.data?.data
          ?? response.data
          ?? [];

        const savedItem = Array.isArray(savedItems)
          ? savedItems.find(item => {
              const internshipId =
                item.internshipId?._id ?? item.internshipId;

              return String(internshipId) === String(id);
            })
          : null;

        if (savedItem) {
          await savedInternshipAPI.delete(savedItem._id);
        }

        setIsSaved(false);
        setToast({
          message: 'Internship removed from saved internships.',
          type: 'info'
        });
      } else {
        await savedInternshipAPI.create({ internshipId: id });

        setIsSaved(true);
        setToast({
          message: 'Internship saved successfully.',
          type: 'success'
        });
      }
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to update saved internship.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isApplied) {
      setToast({
        message: 'You have already applied for this internship.',
        type: 'info'
      });
      return;
    }

    setApplying(true);

    try {
      await applicationAPI.create({ internshipId: id });

      setIsApplied(true);
      setToast({
        message: 'Application submitted successfully.',
        type: 'success'
      });
    } catch (err) {
      setToast({
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to submit application.',
        type: 'error'
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}
      >
        <Loader2
          size={48}
          color="var(--primary)"
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>
          Loading internship details...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <AlertCircle
            size={64}
            color="var(--danger)"
            style={{ marginBottom: '24px' }}
          />
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
            Internship Not Found
          </h2>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
            The internship you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/internships" className="btn btn-primary">
            Browse All Internships
          </Link>
        </div>
      </div>
    );
  }

  const responsibilities = Array.isArray(internship.responsibilities)
    ? internship.responsibilities
    : [];

  const requiredSkills = Array.isArray(internship.requiredSkills)
    ? internship.requiredSkills
    : [];

  const preferredSkills = Array.isArray(internship.preferredSkills)
    ? internship.preferredSkills
    : [];

  return (
    <div className="container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Link
        to="/internships"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--primary)',
          textDecoration: 'none',
          fontWeight: '500',
          marginBottom: '24px'
        }}
      >
        <ArrowLeft size={20} />
        Back to Internships
      </Link>

      <div
        className="grid"
        style={{
          gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
          gap: '32px'
        }}
      >
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                marginBottom: '24px'
              }}
            >
              <img
                src={
                  internship.companyLogo ||
                  internship.logo ||
                  'https://placehold.co/80x80?text=Company'
                }
                alt={internship.company || 'Company'}
                onError={event => {
                  event.currentTarget.src =
                    'https://placehold.co/80x80?text=Company';
                }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  objectFit: 'cover'
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>
                  {internship.title}
                </h1>

                <p style={{
                  fontSize: '18px',
                  color: 'var(--gray)',
                  marginBottom: '12px'
                }}>
                  {internship.company}
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <span>
                    <MapPin size={16} style={{ verticalAlign: 'middle' }} />{' '}
                    {internship.location || 'Not specified'}
                  </span>
                  <span>
                    <Building2 size={16} style={{ verticalAlign: 'middle' }} />{' '}
                    {internship.workMode || 'Not specified'}
                  </span>
                  <span>
                    <Clock size={16} style={{ verticalAlign: 'middle' }} />{' '}
                    {internship.duration || 'Not specified'}
                  </span>
                  <span>
                    <DollarSign size={16} style={{ verticalAlign: 'middle' }} />{' '}
                    {internship.stipend ?? 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleApply}
                disabled={isApplied || applying}
                className="btn btn-primary"
                style={{ flex: 1, padding: '16px' }}
              >
                {applying
                  ? 'Submitting...'
                  : isApplied
                    ? 'Applied'
                    : 'Apply Now'}
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className={`btn ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '16px' }}
              >
                <Bookmark size={20} />
                {saving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <h2>Description</h2>
            <p style={{ color: 'var(--gray)', lineHeight: '1.8' }}>
              {internship.description || 'No description available.'}
            </p>
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <h2>Responsibilities</h2>
            {responsibilities.length ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {responsibilities.map((responsibility, index) => (
                  <li
                    key={`${index}-${responsibility}`}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '12px',
                      color: 'var(--gray)',
                      lineHeight: '1.6'
                    }}
                  >
                    <CheckCircle
                      size={20}
                      color="var(--primary)"
                      style={{ flexShrink: 0 }}
                    />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No responsibilities listed.</p>
            )}
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <h2>Required Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {requiredSkills.length ? requiredSkills.map(skill => (
                <span key={skill} className="badge badge-primary">
                  {skill}
                </span>
              )) : <p>No required skills listed.</p>}
            </div>
          </div>

          {preferredSkills.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <h2>Preferred Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {preferredSkills.map(skill => (
                  <span key={skill} className="badge badge-info">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="card" style={{ position: 'sticky', top: '96px' }}>
            <h3>Quick Info</h3>

            {[
              ['Company', internship.company],
              ['Location', internship.location],
              ['Work Mode', internship.workMode],
              ['Duration', internship.duration],
              ['Stipend', internship.stipend],
              ['Openings', internship.openings],
              [
                'Application Deadline',
                internship.applicationDeadline
                  ? new Date(internship.applicationDeadline).toLocaleDateString()
                  : null
              ]
            ].filter(([, value]) => value !== null && value !== undefined && value !== '').map(([label, value]) => (
              <div key={label} style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--gray)',
                  marginBottom: '4px'
                }}>
                  {label}
                </p>
                <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  {value}
                </p>
              </div>
            ))}

            <button
              onClick={handleApply}
              disabled={isApplied || applying}
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px' }}
            >
              {applying ? 'Submitting...' : isApplied ? 'Applied' : 'Apply Now'}
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`btn ${isSaved ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', marginTop: '12px', padding: '16px' }}
            >
              <Bookmark size={20} style={{ marginRight: '8px' }} />
              {saving ? 'Saving...' : isSaved ? 'Saved' : 'Save Internship'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default InternshipDetails;
