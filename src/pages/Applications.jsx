import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock as ClockIcon, ExternalLink, Calendar, Building2, Loader2, AlertCircle, Filter } from 'lucide-react';
import '../styles/global.css';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await applicationAPI.getAll(params);
      setApplications(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (!user) return;
    fetchApplications();
  }, [user, fetchApplications]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shortlisted':
        return <CheckCircle size={20} color="#10b981" />;
      case 'Rejected':
        return <XCircle size={20} color="#ef4444" />;
      case 'Under Review':
        return <ClockIcon size={20} color="#f59e0b" />;
      default:
        return <ClockIcon size={20} color="#6366f1" />;
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
        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>Loading applications...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
          My Applications
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
          Track your internship applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)', margin: '0 0 8px' }}>
            {applications.length}
          </h3>
          <p style={{ color: 'var(--gray)', fontSize: '14px', margin: 0 }}>Total Applications</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', margin: '0 0 8px' }}>
            {applications.filter(a => a.status === 'Under Review').length}
          </h3>
          <p style={{ color: 'var(--gray)', fontSize: '14px', margin: 0 }}>Under Review</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', margin: '0 0 8px' }}>
            {applications.filter(a => a.status === 'Shortlisted').length}
          </h3>
          <p style={{ color: 'var(--gray)', fontSize: '14px', margin: 0 }}>Shortlisted</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444', margin: '0 0 8px' }}>
            {applications.filter(a => a.status === 'Rejected').length}
          </h3>
          <p style={{ color: 'var(--gray)', fontSize: '14px', margin: 0 }}>Rejected</p>
        </div>
      </div>

      {/* Filter */}
      <div className="card" style={{ marginBottom: '32px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Filter size={20} color="var(--gray)" />
          <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--gray)' }}>Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '2px solid var(--gray-light)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', marginBottom: '32px' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Error Loading Applications
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>{error}</p>
          <button onClick={fetchApplications} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <Calendar size={64} color="var(--gray)" style={{ marginBottom: '24px' }} />
          <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            No Applications Yet
          </h3>
          <p style={{ color: 'var(--gray)', fontSize: '16px', marginBottom: '32px' }}>
            Start applying to internships to track your progress here
          </p>
          <Link to="/internships" className="btn btn-primary">
            Browse Internships
          </Link>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr style={{ background: 'var(--light)' }}>
                <th>Internship</th>
                <th>Company</th>
                <th>Location</th>
                <th>Work Mode</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => {
                const internship = application.internshipId;
                if (!internship) return null;

                return (
                  <tr key={application._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={internship.companyLogo || internship.logo || 'https://via.placeholder.com/40'}
                          alt={application.company}
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '15px', margin: 0 }}>
                            {internship.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={16} color="var(--gray)" />
                        <span style={{ fontSize: '14px' }}>{internship.company}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px' }}>{internship.location}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '12px' }}>
                        {internship.workMode}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="var(--gray)" />
                        <span style={{ fontSize: '14px' }}>
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(application.status)}
                        {getStatusBadge(application.status)}
                      </div>
                    </td>
                    <td>
                      <Link
                        to={`/internships/${internship._id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex' }}
                      >
                        <ExternalLink size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;
