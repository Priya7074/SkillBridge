import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, User, Edit, Trash2, Mail, Loader2, AlertCircle } from 'lucide-react';
import Toast from '../../components/Toast';
import '../../styles/global.css';

const StudentManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...(searchQuery && { search: searchQuery })
      };
      const response = await adminAPI.getAllStudents(params);
      setStudents(response.data);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, searchQuery]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchStudents();
  }, [user, navigate, fetchStudents]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm.trim());
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    setDeletingId(studentId);
    try {
      await adminAPI.deleteStudent(studentId);
      setStudents(prev => prev.filter(s => s._id !== studentId));
      setToast({ message: 'Student deleted successfully', type: 'success' });
      fetchStudents();
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete student', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--gray)', marginLeft: '16px' }}>Loading students...</p>
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
            Student Management
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '18px' }}>
            Manage student accounts and permissions
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <Search size={20} color="var(--gray)" />
            <input
              type="text"
              placeholder="Search by name, email, or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', marginBottom: '32px' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Error Loading Students
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>{error}</p>
          <button onClick={fetchStudents} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && students.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <User size={64} color="var(--gray)" style={{ marginBottom: '24px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            No Students Found
          </h3>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
            {searchTerm ? 'Try adjusting your search terms' : 'No students registered yet'}
          </p>
        </div>
      )}

      {!loading && !error && students.length > 0 && (
        <>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Degree</th>
                  <th>Graduation Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={20} color="var(--primary)" />
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', margin: 0 }}>{student.name}</p>
                          <p style={{ fontSize: '13px', color: 'var(--gray)', margin: 0 }}>Student</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} color="var(--gray)" />
                        {student.email}
                      </div>
                    </td>
                    <td>{student.college || 'Not specified'}</td>
                    <td>{student.degree || 'Not specified'}</td>
                    <td>{student.graduationYear || 'Not specified'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          disabled={deletingId === student._id}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '6px 12px', opacity: deletingId === student._id ? 0.6 : 1 }}
                        >
                          {deletingId === student._id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                        </button>
                      </div>
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

export default StudentManagement;
