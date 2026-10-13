import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { internshipAPI, savedInternshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Clock, DollarSign, Building2, Filter, ChevronDown, Bookmark, AlertCircle, Loader2, Briefcase } from 'lucide-react';
import Toast from '../components/Toast';
import '../styles/global.css';

const Internships = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [savedInternships, setSavedInternships] = useState([]);
  const [savingInternshipId, setSavingInternshipId] = useState(null);
  const fetchSequence = useRef(0);
  const userId = user?.id || user?._id;

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    workMode: '',
    minStipend: '',
    maxStipend: '',
    skills: '',
    page: 1,
    limit: 10
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1
  });

  const fetchInternships = useCallback(async () => {
    const currentSequence = ++fetchSequence.current;
    try {
      setLoading(true);
      const response = await internshipAPI.getAll(filters);
      if (!Array.isArray(response.data)) throw new Error('The server returned an invalid internship list.');
      if (currentSequence !== fetchSequence.current) return;
      setInternships(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        totalPages: response.totalPages
      });
      setError('');
    } catch (err) {
      if (currentSequence === fetchSequence.current) {
        setError(err.message || 'Failed to fetch internships');
      }
    } finally {
      if (currentSequence === fetchSequence.current) setLoading(false);
    }
  }, [filters]);

  const fetchSavedInternships = useCallback(async () => {
    try {
      const response = await savedInternshipAPI.getAll();
      setSavedInternships(response.data.map(item => item.internshipId._id));
    } catch (err) {
      setToast({ message: err.message || 'Failed to load saved internship status.', type: 'error' });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchInternships();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchInternships]);

  useEffect(() => {
    if (!userId) return;
    fetchSavedInternships();
  }, [userId, fetchSavedInternships]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to page 1 when filters change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      workMode: '',
      minStipend: '',
      maxStipend: '',
      skills: '',
      page: 1,
      limit: 10
    });
  };

  const handleSave = async (internshipId) => {
    if (savingInternshipId === internshipId) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setSavingInternshipId(internshipId);
    try {
      if (savedInternships.includes(internshipId)) {
        // Unsave
        const saved = await savedInternshipAPI.getAll();
        const toDelete = saved.data.find(item => item.internshipId._id === internshipId);
        if (toDelete) {
          await savedInternshipAPI.delete(toDelete._id);
          setSavedInternships(prev => prev.filter(id => id !== internshipId));
          setToast({ message: 'Internship removed from saved internships', type: 'info' });
        }
      } else {
        // Save
        await savedInternshipAPI.create({ internshipId });
        setSavedInternships(prev => [...prev, internshipId]);
        setToast({ message: 'Internship saved successfully', type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to save internship', type: 'error' });
    } finally {
      setSavingInternshipId(null);
    }
  };

  const isSaved = (id) => savedInternships.includes(id);

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
          Internships
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
          Discover your next opportunity
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '32px', padding: '24px' }}>
        <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
          <div className="search-bar" style={{ marginBottom: 0, width: '100%' }}>
            <Search size={20} color="var(--gray)" />
            <input
              type="text"
              aria-label="Search internships by company, role, or skill"
              placeholder="Search by company, role, or skill..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </form>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray)' }}>
              Category
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <Filter size={18} color="var(--gray)" />
              <select
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
                value={filters.category}
                aria-label="Filter internships by category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown size={18} color="var(--gray)" />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray)' }}>
              Location
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <MapPin size={18} color="var(--gray)" />
              <input
                type="text"
                aria-label="Filter internships by location"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'transparent'
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray)' }}>
              Work Mode
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <Building2 size={18} color="var(--gray)" />
              <select
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
                value={filters.workMode}
                aria-label="Filter internships by work mode"
                onChange={(e) => handleFilterChange('workMode', e.target.value)}
              >
                <option value="">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <ChevronDown size={18} color="var(--gray)" />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray)' }}>
              Min Stipend
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <DollarSign size={18} color="var(--gray)" />
              <input
                type="number"
                aria-label="Filter internships by minimum stipend"
                placeholder="Min amount"
                value={filters.minStipend}
                onChange={(e) => handleFilterChange('minStipend', e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'transparent'
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray)' }}>
              Skills
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <Filter size={18} color="var(--gray)" />
              <input
                type="text"
                aria-label="Filter internships by required skill"
                placeholder="e.g., React, Python"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'transparent'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={clearFilters}
            className="btn btn-secondary btn-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--gray)', marginTop: '16px' }}>Loading internships...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
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

      {/* Empty State */}
      {!loading && !error && internships.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Briefcase size={48} color="var(--gray)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            No Internships Found
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
            Try adjusting your filters or search terms
          </p>
          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      )}

      {/* Internship Cards */}
      {!loading && !error && internships.length > 0 && (
        <>
          <div className="grid grid-3" style={{ gap: '24px', marginBottom: '40px' }}>
            {internships.map((internship) => (
              <div key={internship._id} className="card" style={{ padding: '24px' }}>
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
                  {internship.duration && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--gray)' }}>
                      <Clock size={14} />
                      {internship.duration}
                    </div>
                  )}
                  {(internship.stipend || internship.stipendAmount > 0) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--gray)' }}>
                      <DollarSign size={14} />
                      {internship.stipend || internship.stipendAmount}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(internship.requiredSkills || []).slice(0, 3).map((skill) => (
                      <span key={skill} className="badge badge-primary" style={{ fontSize: '11px' }}>
                        {skill}
                      </span>
                    ))}
                    {(internship.requiredSkills || []).length > 3 && (
                      <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                        +{internship.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {internship.applicationDeadline && (
                  <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--gray)' }}>
                    Deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    to={`/internships/${internship._id}`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleSave(internship._id)}
                    disabled={savingInternshipId === internship._id}
                    className={`btn btn-sm ${isSaved(internship._id) ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                  >
                    <Bookmark size={16} />
                    {isSaved(internship._id) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleFilterChange('page', Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className="btn btn-secondary btn-sm"
                style={{ padding: '8px 16px' }}
              >
                Previous
              </button>
              <span style={{ color: 'var(--gray)' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handleFilterChange('page', Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="btn btn-secondary btn-sm"
                style={{ padding: '8px 16px' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Internships;
