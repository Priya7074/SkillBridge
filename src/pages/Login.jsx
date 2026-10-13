import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/global.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    const email = formData.email.trim();
    if (!email || !formData.password) {
      setError('Please provide email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.login({ ...formData, email });

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
            Welcome Back
          </h2>
          <p style={{ color: 'var(--gray)', margin: 0 }}>
            Sign in to continue to your account
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--dark)' }}>
              Email Address
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
              Password
            </label>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <Lock size={20} color="var(--gray)" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} disabled={loading} />
              Remember me
            </label>
            <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray)', marginBottom: '16px' }}>
            Don't have an account?
          </p>
          <Link
            to="/register"
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
