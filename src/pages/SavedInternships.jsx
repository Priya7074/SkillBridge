import { Link, useNavigate } from 'react-router-dom';
import { savedInternshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { MapPin, Building2, DollarSign, Trash2, Loader2, Bookmark, AlertCircle } from 'lucide-react';
import Toast from '../components/Toast';
import '../styles/global.css';

const SavedInternships = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedInternships, setSavedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const userId = user?.id || user?._id;

  const fetchSavedInternships = useCallback(async () => {
    try {
      const response = await savedInternshipAPI.getAll();
      setSavedInternships(response.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch saved internships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchSavedInternships();
  }, [userId, navigate, fetchSavedInternships]);

  const handleRetry = () => {
    setLoading(true);
    fetchSavedInternships();
  };

  const handleRemove = async (savedId) => {
    if (!window.confirm('Are you sure you want to remove this internship from saved?')) {
      return;
    }

    setDeletingId(savedId);
    try {
      await savedInternshipAPI.delete(savedId);
      setSavedInternships(prev => prev.filter(item => item._id !== savedId));
      setToast({ message: 'Internship removed from saved internships', type: 'info' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to remove internship', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>Loading saved internships...</p>
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

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
          Saved Internships
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
          Internships you've saved for later
        </p>
      </div>

      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', marginBottom: '32px' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Error Loading Saved Internships
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>{error}</p>
          <button onClick={handleRetry} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && savedInternships.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <Bookmark size={64} color="var(--gray)" style={{ marginBottom: '24px' }} />
          <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            No Saved Internships Yet
          </h3>
          <p style={{ color: 'var(--gray)', fontSize: '16px', marginBottom: '32px' }}>
            Start saving internships you're interested in by clicking the Save button on any internship listing.
          </p>
          <Link to="/internships" className="btn btn-primary">
            Browse Internships
          </Link>
        </div>
      )}

      {!loading && !error && savedInternships.length > 0 && (
        <div className="grid grid-3" style={{ gap: '24px' }}>
          {savedInternships.map((saved) => {
            const internship = saved.internshipId;
            if (!internship) return null;

            return (
              <div key={saved._id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                  <img
                    src={internship.companyLogo || internship.logo || 'https://via.placeholder.com/56'}
                    alt={internship.company}
                    style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
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

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--gray)' }}>
                    <MapPin size={14} />
                    {internship.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--gray)' }}>
                    <Building2 size={14} />
                    {internship.workMode}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--gray)' }}>
                    <DollarSign size={14} />
                    {internship.stipend}
                  </div>
                </div>

                <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--gray)' }}>
                  Saved on {new Date(saved.createdAt).toLocaleDateString()}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    to={`/internships/${internship._id}`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(saved._id)}
                    disabled={deletingId === saved._id}
                    className="btn btn-danger btn-sm"
                  >
                    {deletingId === saved._id ? (
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedInternships;
