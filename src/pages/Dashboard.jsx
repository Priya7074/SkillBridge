import { Link } from 'react-router-dom';
import { internshipAPI, applicationAPI, savedInternshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Briefcase, FileText, Star, MapPin, Clock, DollarSign, ExternalLink, Bookmark, CheckCircle, XCircle, Clock as ClockIcon, Loader2, AlertCircle } from 'lucide-react';
import '../styles/global.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    savedInternships: 0,
    shortlisted: 0,
    availableInternships: 0
  });
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch applications
      const applicationsResponse = await applicationAPI.getAll();
      const applications = applicationsResponse.data;

      // Fetch saved internships
      const savedResponse = await savedInternshipAPI.getAll();
      const saved = savedResponse.data;

      // Fetch internships for recommendations
      const internshipsResponse = await internshipAPI.getAll({ limit: 4 });
      const internships = internshipsResponse.data;

      setStats({
        applications: applications.length,
        savedInternships: saved.length,
        shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
        availableInternships: internshipsResponse.total
      });

      setRecommendedInternships(internships);
      setRecentApplications(applications.slice(0, 5));
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shortlisted':
        return <CheckCircle size={16} color="#10b981" />;
      case 'Rejected':
        return <XCircle size={16} color="#ef4444" />;
      case 'Under Review':
        return <ClockIcon size={16} color="#f59e0b" />;
      default:
        return <ClockIcon size={16} color="#6366f1" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return <span className="badge badge-success">{status}</span>;
      case 'Rejected':
        return <span className="badge badge-danger">{status}</span>;
      case 'Under Review':
        return <span className="badge badge-warning">{status}</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>Loading dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container">
      {error && (
        <div className="card" role="alert" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <AlertCircle size={24} color="var(--danger)" />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>Unable to load all dashboard data</h2>
              <p style={{ color: 'var(--gray)' }}>{error}</p>
            </div>
            <button onClick={fetchDashboardData} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="dashboard-welcome-title" style={{ fontWeight: '700', marginBottom: '8px' }}>
          Welcome back, {user.name ? user.name.split(' ')[0] : 'Student'}!
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
          Here's what's happening with your applications today.
        </p>
      </div>

      {!error && (
      <>
      {/* Statistics Cards */}
      <div className="grid grid-4" style={{ marginBottom: '40px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: '#e0e7ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={24} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
              {stats.applications}
            </span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray)', margin: 0 }}>
            Applications
          </h3>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: '#e0e7ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bookmark size={24} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
              {stats.savedInternships}
            </span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray)', margin: 0 }}>
            Saved Internships
          </h3>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: '#e0e7ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Briefcase size={24} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
              {stats.availableInternships}
            </span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray)', margin: 0 }}>
            Available Internships
          </h3>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: '#e0e7ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Star size={24} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
              {stats.shortlisted}
            </span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray)', margin: 0 }}>
            Shortlisted
          </h3>
        </div>
      </div>

      <div className="grid dashboard-primary-grid">
        {/* Recommended Internships */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="dashboard-section-title" style={{ fontWeight: '700' }}>Recommended Internships</h2>
            <Link
              to="/internships"
              style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All
              <ExternalLink size={16} />
            </Link>
          </div>

          <div className="grid grid-2" style={{ gap: '24px' }}>
            {recommendedInternships.length === 0 ? (
              <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                <p style={{ color: 'var(--gray)', marginBottom: '16px' }}>
                  No internship recommendations are available right now.
                </p>
                <Link to="/internships" className="btn btn-secondary btn-sm">
                  Browse internships
                </Link>
              </div>
            ) : recommendedInternships.map((internship) => (
              <div key={internship._id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
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

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  {internship.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--gray)' }}>
                      <MapPin size={14} />
                      {internship.location}
                    </div>
                  )}
                  {internship.duration && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--gray)' }}>
                      <Clock size={14} />
                      {internship.duration}
                    </div>
                  )}
                  {internship.stipend && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--gray)' }}>
                      <DollarSign size={14} />
                      {internship.stipend}
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
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    to={`/internships/${internship._id}`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div>
          <h2 className="dashboard-section-title" style={{ fontWeight: '700', marginBottom: '24px' }}>
            Recent Applications
          </h2>

          <div className="card" style={{ padding: 0 }}>
            {recentApplications.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--gray)', margin: 0 }}>No applications yet</p>
                <Link to="/internships" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
                  Browse Internships
                </Link>
              </div>
            ) : (
              recentApplications.map((application) => {
                const internship = application.internshipId;
                if (!internship) return null;

                return (
                  <div
                    key={application._id}
                    className="dashboard-application-item"
                    style={{ padding: '20px', borderBottom: '1px solid var(--gray-light)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      {getStatusIcon(application.status)}
                      <h4 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>
                        {internship.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '8px' }}>
                      {internship.company}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--gray)' }}>
                        Applied: {new Date(application.appliedDate).toLocaleDateString()}
                      </span>
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
        </>
        )}
    </div>
  );
};

export default Dashboard;
