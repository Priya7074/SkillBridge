import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Filter, CheckCircle, XCircle, Clock as ClockIcon, Loader2, AlertCircle } from 'lucide-react';
import Toast from '../../components/Toast';
import '../../styles/global.css';

const ApplicationsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...(statusFilter && { status: statusFilter })
      };
      const response = await adminAPI.getAllApplications(params);
      setApplications(response.data);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchApplications();
  }, [user, navigate, fetchApplications]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await adminAPI.updateApplicationStatus(applicationId, { status: newStatus });
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      setToast({ message: `Application status updated to ${newStatus}`, type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update status', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

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
            Application Management
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
            Review and manage internship applications
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Filter size={20} color="var(--gray)" />
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ flex: 1, maxWidth: '300px' }}
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
          <Filter size={64} color="var(--gray)" style={{ marginBottom: '24px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            No Applications Found
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
            {statusFilter ? 'No applications with this status' : 'No applications submitted yet'}
          </p>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Internship</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td>
                      <p style={{ fontWeight: '600', margin: 0 }}>
                        {application.studentId?.name || 'Unknown'}
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--gray)', margin: 0 }}>
                        {application.studentId?.email || 'No email'}
                      </p>
                    </td>
                    <td>
                      <p style={{ fontWeight: '600', margin: 0 }}>
                        {application.internshipId?.title || 'Unknown Internship'}
                      </p>
                    </td>
                    <td>{application.internshipId?.company || 'Unknown'}</td>
                    <td>
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(application.status)}
                        {getStatusBadge(application.status)}
                      </div>
                    </td>
                    <td>
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                        disabled={updatingId === application._id}
                        className="input"
                        style={{ minWidth: '150px', padding: '6px', opacity: updatingId === application._id ? 0.6 : 1 }}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
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
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
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

export default ApplicationsManagement;
