const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error('Unable to connect to SkillBridge. Check your network and try again.');
  }

  const responseText = await response.text();
  let data = {};
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error('The server returned an invalid response. Please try again later.');
      }
    }
  }

  if (response.status === 401 && token) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('skillbridge:unauthorized'));
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status}). Please try again.`);
  }

  return data;
};

// Internship APIs
export const internshipAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/internships${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiCall(`/internships/${id}`),
  create: (data) => apiCall('/internships', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiCall(`/internships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiCall(`/internships/${id}`, {
    method: 'DELETE'
  })
};

// Application APIs
export const applicationAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/applications${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiCall(`/applications/${id}`),
  create: (data) => apiCall('/applications', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiCall(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// Saved Internship APIs
export const savedInternshipAPI = {
  getAll: () => apiCall('/saved-internships'),
  create: (data) => apiCall('/saved-internships', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiCall(`/saved-internships/${id}`, {
    method: 'DELETE'
  })
};

// User APIs
export const userAPI = {
  getAll: () => apiCall('/users'),
  getById: (id) => apiCall(`/users/${id}`),
  update: (id, data) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  updateResume: (data) => apiCall('/users/me/resume', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// Skill APIs
export const skillAPI = {
  getAll: () => apiCall('/skills'),
  create: (data) => apiCall('/skills', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiCall(`/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiCall(`/skills/${id}`, {
    method: 'DELETE'
  })
};

// Get Current User
export const getCurrentUser = () => apiCall('/auth/me');

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => apiCall('/admin/dashboard'),
  getAllStudents: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/students${queryString ? `?${queryString}` : ''}`);
  },
  getStudentById: (id) => apiCall(`/admin/students/${id}`),
  updateStudent: (id, data) => apiCall(`/admin/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteStudent: (id) => apiCall(`/admin/students/${id}`, {
    method: 'DELETE'
  }),
  getAllApplications: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/admin/applications${queryString ? `?${queryString}` : ''}`);
  },
  updateApplicationStatus: (id, data) => apiCall(`/admin/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getApplicationTrends: () => apiCall('/admin/applications/trends')
};

// Skill Gap Analyzer APIs
export const skillGapAPI = {
  getAvailableRoles: () => apiCall('/skill-gap/roles'),
  analyze: (data) => apiCall('/skill-gap/analyze', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

export const searchAPI = {
  search: (query) => apiCall(`/search?q=${encodeURIComponent(query)}`)
};

export const notificationAPI = {
  getAll: () => apiCall('/notifications'),
  markRead: (id) => apiCall(`/notifications/${id}/read`, { method: 'PATCH' })
};

// Auth APIs
export const authAPI = {
  register: (data) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  login: (data) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getMe: () => apiCall('/auth/me'),
  logout: () => apiCall('/auth/logout', {
    method: 'POST'
  })
};
