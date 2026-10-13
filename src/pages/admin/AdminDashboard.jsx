import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, FileText, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import '../../styles/global.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchStats();
  }, [user, navigate, fetchStats]);

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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
          Overview of platform statistics and management
        </p>
      </div>

      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', marginBottom: '32px' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Error Loading Data
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>{error}</p>
          <button onClick={fetchStats} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {stats && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-4" style={{ marginBottom: '32px' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                  {stats.totalStudents}
                </span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray)', margin: 0 }}>
                Total Students
              </h3>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={24} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                  {stats.totalInternships}
                </span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray)', margin: 0 }}>
                Total Internships
              </h3>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={24} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                  {stats.totalApplications}
                </span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray)', margin: 0 }}>
                Total Applications
              </h3>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={24} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                  {stats.applicationStatuses.Shortlisted || 0}
                </span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--gray)', margin: 0 }}>
                Shortlisted
              </h3>
            </div>
          </div>

          {/* Application Status Breakdown */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
              Application Status Breakdown
            </h3>
            <div className="grid grid-4" style={{ gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: 'var(--light)', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '32px', fontWeight: '700', color: '#6366f1', margin: '0 0 8px 0' }}>
                  {stats.applicationStatuses.Applied || 0}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>Applied</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: 'var(--light)', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', margin: '0 0 8px 0' }}>
                  {stats.applicationStatuses['Under Review'] || 0}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>Under Review</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: 'var(--light)', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', margin: '0 0 8px 0' }}>
                  {stats.applicationStatuses.Shortlisted || 0}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>Shortlisted</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: 'var(--light)', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444', margin: '0 0 8px 0' }}>
                  {stats.applicationStatuses.Rejected || 0}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>Rejected</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
