import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/global.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    degree: '',
    branch: '',
    graduationYear: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const name = formData.name.trim();
    const email = formData.email.trim();
    if (!name || !email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.register({ ...formData, name, email });

      // Store token and user data
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '24px'
      }}
    >
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'var(--primary)',
              marginBottom: '24px'
            }}
          >
            <GraduationCap size={40} />
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>SkillBridge</h1>
          </Link>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--gray)', margin: 0 }}>
            Join SkillBridge and start your career journey
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#991b1b',
              fontSize: '14px'
            }}
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
              Full Name *
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <User size={20} color="var(--gray)" />
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
              Email Address *
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <Mail size={20} color="var(--gray)" />
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
              Password *
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <Lock size={20} color="var(--gray)" />
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
              Confirm Password *
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <Lock size={20} color="var(--gray)" />
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
              College
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <User size={20} color="var(--gray)" />
              <input
                type="text"
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
              Degree
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <User size={20} color="var(--gray)" />
              <input
                type="text"
                name="degree"
                placeholder="e.g., Bachelor of Technology"
                value={formData.degree}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
              Branch
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <User size={20} color="var(--gray)" />
              <input
                type="text"
                name="branch"
                placeholder="e.g., Computer Science"
                value={formData.branch}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
              Graduation Year
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <User size={20} color="var(--gray)" />
              <input
                type="number"
                name="graduationYear"
                placeholder="e.g., 2025"
                value={formData.graduationYear}
                onChange={handleChange}
                disabled={loading}
                min="2020"
                max="2030"
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
            <input type="checkbox" style={{ cursor: 'pointer', marginTop: '4px' }} disabled={loading} required />
            <span style={{ color: 'var(--gray)' }}>
              I agree to the <a href="#" style={{ color: 'var(--primary)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>
            </span>
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : (
              <>
                Create Account
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray)', marginBottom: '16px' }}>
            Already have an account?
          </p>
          <Link
            to="/login"
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
