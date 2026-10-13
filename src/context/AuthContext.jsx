import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const readStoredSession = () => {
  try {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!storedToken || !storedUser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { user: null, token: null };
    }
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || typeof parsedUser !== 'object' || Array.isArray(parsedUser)
      || !(parsedUser.id || parsedUser._id)) {
      throw new Error('Invalid stored user data');
    }
    return { user: parsedUser, token: storedToken };
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [initialSession] = useState(readStoredSession);
  const [user, setUser] = useState(initialSession.user);
  const [token, setToken] = useState(initialSession.token);
  const [loading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('skillbridge:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('skillbridge:unauthorized', handleUnauthorized);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    const persistedUser = { ...userData };
    if (typeof persistedUser.profileImage === 'string' && persistedUser.profileImage.startsWith('data:image/')) {
      delete persistedUser.profileImage;
    }
    localStorage.setItem('user', JSON.stringify(persistedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
