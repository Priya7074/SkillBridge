 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Bookmark,
  Shield,
  Users,
  Brain
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/global.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMobileOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'My Profile' },
    { path: '/skills', icon: BookOpen, label: 'My Skills' },
    { path: '/skill-gap', icon: Brain, label: 'Skill Gap Analyzer' },
    { path: '/internships', icon: Briefcase, label: 'Internships' },
    { path: '/saved-internships', icon: Bookmark, label: 'Saved Internships' },
    { path: '/applications', icon: FileText, label: 'Applications' },
    { path: '/resume-builder', icon: GraduationCap, label: 'Resume Builder' },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: Shield, label: 'Admin Dashboard' },
    { path: '/admin/students', icon: Users, label: 'Student Management' },
    { path: '/admin/internships', icon: Briefcase, label: 'Internship Management' },
    { path: '/admin/applications', icon: FileText, label: 'Application Management' },
  ];

  const isActive = (path) => location.pathname === path
    || (path === '/internships' && location.pathname.startsWith('/internships/'));

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileOpen(false);
  };

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileOpen}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1001,
          display: 'none',
          padding: '12px',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className="sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: '280px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          background: 'white',
          boxShadow: 'var(--shadow-lg)',
          padding: '24px',
          zIndex: 1000,
          transform: 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'var(--primary)'
            }}
          >
            <GraduationCap size={32} />
            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
              SkillBridge
            </h1>
          </Link>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item) => (
              <li key={item.path} style={{ marginBottom: '8px' }}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive(item.path) ? 'var(--primary)' : 'var(--gray)',
                    background: isActive(item.path) ? '#e0e7ff' : 'transparent',
                    fontWeight: isActive(item.path) ? '600' : '400',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {isAdmin() && (
          <div
            style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid var(--gray-light)'
            }}
          >
            <p
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--gray)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}
            >
              Admin
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {adminMenuItems.map((item) => (
                <li key={item.path} style={{ marginBottom: '8px' }}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive(item.path) ? 'var(--primary)' : 'var(--gray)',
                      background: isActive(item.path) ? '#e0e7ff' : 'transparent',
                      fontWeight: isActive(item.path) ? '600' : '400',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid var(--gray-light)'
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: 'var(--danger)',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <style>
        {`
          @media (max-width: 768px) {
            .sidebar {
              transform: ${isMobileOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            }

            .mobile-menu-btn {
              display: block !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;
