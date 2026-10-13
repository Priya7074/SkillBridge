import { Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationAPI, searchAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import '../styles/global.css';

const Header = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const currentUser = authUser || {};
  const authUserId = authUser?.id || authUser?._id;
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!authUserId) return undefined;

    let active = true;
    notificationAPI.getAll()
      .then(response => {
        if (!active) return;
        if (!Array.isArray(response.data) || !Number.isInteger(response.unreadCount)) {
          throw new Error('The server returned an invalid notifications response.');
        }
        setNotifications(response.data);
        setUnreadCount(response.unreadCount);
        setNotificationsError('');
      })
      .catch(error => {
        if (active) setNotificationsError(error.message || 'Notifications could not be loaded.');
      });

    return () => {
      active = false;
    };
  }, [authUserId]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const normalizedQuery = query.trim().replace(/\s+/g, ' ');
    if (!normalizedQuery) {
      setSearchError('Enter a search term.');
      setSearchResults([]);
      setSearchOpen(true);
      return;
    }

    setQuery(normalizedQuery);
    setSearchLoading(true);
    setSearchError('');
    setSearchOpen(true);
    try {
      const response = await searchAPI.search(normalizedQuery);
      if (!Array.isArray(response.data)) throw new Error('The server returned invalid search results.');
      setSearchResults(response.data);
    } catch (error) {
      setSearchError(error.message || 'Search could not be completed. Please try again.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleNotifications = async () => {
    const willOpen = !notificationsOpen;
    setNotificationsOpen(willOpen);
    setSearchOpen(false);
    if (!willOpen) return;

    setNotificationsLoading(true);
    setNotificationsError('');
    try {
      const response = await notificationAPI.getAll();
      if (!Array.isArray(response.data) || !Number.isInteger(response.unreadCount)) {
        throw new Error('The server returned an invalid notifications response.');
      }
      setNotifications(response.data);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      setNotificationsError(error.message || 'Notifications could not be loaded.');
    } finally {
      setNotificationsLoading(false);
    }
  };

  const openNotification = async (notification) => {
    if (!notification.read) {
      try {
        await notificationAPI.markRead(notification._id);
        setNotifications(current => current.map(item =>
          item._id === notification._id ? { ...item, read: true } : item
        ));
        setUnreadCount(count => Math.max(0, count - 1));
      } catch (error) {
        setNotificationsError(error.message || 'Notification could not be marked as read.');
        return;
      }
    }
    setNotificationsOpen(false);
    if (notification.link?.startsWith('/') && !notification.link.startsWith('//')) {
      navigate(notification.link);
    }
  };

  return (
    <header
      className="header-bar"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: '280px',
        height: '72px',
        background: 'white',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '0 32px',
        zIndex: 999,
        boxSizing: 'border-box'
      }}
    >
      <div ref={searchRef} className="header-search-wrap" style={{ position: 'relative', width: 'min(400px, 45vw)', flexShrink: 1 }}>
        <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: 0, width: '100%', boxSizing: 'border-box' }}>
          <input
            type="search"
            aria-label="Search SkillBridge"
            placeholder="Search internships, skills, projects..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => {
              if (searchResults.length || searchError) setSearchOpen(true);
            }}
            style={{ minWidth: 0 }}
          />
          <button type="submit" aria-label="Search" disabled={searchLoading} style={iconButtonStyle}>
            {searchLoading
              ? <span aria-label="Searching" style={spinnerStyle} />
              : <Search size={20} color="var(--gray)" />}
          </button>
        </form>
        {searchOpen && (
          <div style={{ ...dropdownStyle, left: 0, width: 'min(420px, 88vw)' }}>
            {searchLoading ? (
              <p style={dropdownMessageStyle}>Searching…</p>
            ) : searchError ? (
              <p role="alert" style={{ ...dropdownMessageStyle, color: 'var(--danger)' }}>{searchError}</p>
            ) : searchResults.length === 0 ? (
              <p style={dropdownMessageStyle}>No matching results found.</p>
            ) : searchResults.map(result => (
              <button
                type="button"
                key={`${result.type}-${result.id}`}
                onClick={() => {
                  setSearchOpen(false);
                  setQuery('');
                  navigate(result.href);
                }}
                style={resultButtonStyle}
              >
                <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <strong style={{ display: 'block', color: 'var(--dark)' }}>{result.title}</strong>
                  <span style={{ display: 'block', color: 'var(--gray)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {result.detail}
                  </span>
                </span>
                <span className="badge badge-info">{result.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div ref={notificationsRef} style={{ position: 'relative' }}>
          <button
            type="button"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={notificationsOpen}
            onClick={toggleNotifications}
            style={{ ...iconButtonStyle, padding: '12px', position: 'relative' }}
          >
            <Bell size={24} color="var(--gray)" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                boxSizing: 'border-box',
                borderRadius: '10px',
                background: 'var(--danger)',
                color: 'white',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </button>
          {notificationsOpen && (
            <div style={{ ...dropdownStyle, right: 0, width: 'min(360px, 88vw)' }}>
              <h3 style={{ margin: '0', padding: '16px', fontSize: '16px', borderBottom: '1px solid var(--gray-light)' }}>
                Notifications
              </h3>
              {notificationsLoading ? (
                <p style={dropdownMessageStyle}>Loading notifications…</p>
              ) : notificationsError ? (
                <p role="alert" style={{ ...dropdownMessageStyle, color: 'var(--danger)' }}>{notificationsError}</p>
              ) : notifications.length === 0 ? (
                <p style={dropdownMessageStyle}>No notifications yet.</p>
              ) : (
                <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {notifications.map(notification => (
                    <button
                      type="button"
                      key={notification._id}
                      onClick={() => openNotification(notification)}
                      style={{
                        ...resultButtonStyle,
                        background: notification.read ? 'white' : '#eef2ff',
                        alignItems: 'flex-start'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', flex: '0 0 8px', borderRadius: '50%', marginTop: '6px', background: notification.read ? 'transparent' : 'var(--primary)' }} />
                      <span style={{ flex: 1, textAlign: 'left' }}>
                        <strong style={{ display: 'block', color: 'var(--dark)' }}>{notification.title}</strong>
                        <span style={{ display: 'block', color: 'var(--gray)', fontSize: '13px' }}>{notification.message}</span>
                        <span style={{ display: 'block', color: 'var(--gray)', fontSize: '11px', marginTop: '4px' }}>
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="header-profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px',
            borderRadius: '24px',
            background: 'var(--light)',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--gray-light)'}
          onMouseLeave={(e) => e.target.style.background = 'var(--light)'}
        >
          {currentUser.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <span aria-hidden="true" style={{
              width: '40px',
              height: '40px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              background: '#e0e7ff',
              color: 'var(--primary)',
              fontWeight: 700
            }}>{currentUser.name?.trim()?.[0]?.toUpperCase() || 'A'}</span>
          )}
          <div>
            <p className="header-profile-name" style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--dark)' }}>
              {currentUser.name || 'Account'}
            </p>
            <p className="header-profile-role" style={{ margin: 0, fontSize: '12px', color: 'var(--gray)' }}>
              {currentUser.role === 'admin' ? 'Administrator' : 'Student'}
            </p>
          </div>
        </div>
      </div>

    </header>
  );
};

const iconButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  background: 'transparent',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 10px)',
  zIndex: 1100,
  background: 'white',
  borderRadius: '12px',
  boxShadow: 'var(--shadow-lg)',
  border: '1px solid var(--gray-light)',
  overflow: 'hidden'
};

const dropdownMessageStyle = {
  margin: 0,
  padding: '20px 16px',
  color: 'var(--gray)',
  fontSize: '14px'
};

const resultButtonStyle = {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  border: 'none',
  borderBottom: '1px solid var(--gray-light)',
  background: 'white',
  cursor: 'pointer',
  textAlign: 'left'
};

const spinnerStyle = {
  width: '16px',
  height: '16px',
  border: '2px solid var(--gray-light)',
  borderTopColor: 'var(--primary)',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

export default Header;
