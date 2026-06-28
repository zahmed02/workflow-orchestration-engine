import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: add JWT token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Sending token:', token.substring(0, 20) + '...'); // log partial token
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: log errors but do NOT redirect automatically
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
      // Only redirect for 401 (Unauthorized), not for 403 (Forbidden)
      // We'll let the app handle 403 gracefully
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ---------- Auth ----------
export const login = (username, password) =>
  axios.post(`${API_URL}/auth/login`, { username, password });

export const register = (username, password) =>
  axios.post(`${API_URL}/auth/register`, { username, password });

// ---------- (rest of endpoints unchanged) ----------
export const getTasks = (params) => api.get('/tasks', { params });
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const undoTask = (id) => api.post(`/tasks/${id}/undo`);

export const getWorkflows = () => api.get('/workflows');
export const getWorkflow = (id) => api.get(`/workflows/${id}`);
export const createWorkflow = (data) => api.post('/workflows', data);
export const deleteWorkflow = (id) => api.delete(`/workflows/${id}`);
export const executeWorkflow = (id) => api.post(`/workflows/${id}/execute`);

export const getResources = () => api.get('/resources');
export const createResource = (resource) => api.post('/resources', resource);
export const updateResource = (id, resource) => api.put(`/resources/${id}`, resource);
export const deleteResource = (id) => api.delete(`/resources/${id}`);

export const getTemplates = () => api.get('/workflows/templates');
export const saveTemplate = (name, workflow) => api.post(`/workflows/templates/${name}`, workflow);
export const getTemplate = (name) => api.get(`/workflows/templates/${name}`);
export const deleteTemplate = (name) => api.delete(`/workflows/templates/${name}`);

export const getUndoHistory = () => api.get('/undo/history');
export const getRecentLogs = () => api.get('/logs/recent');
export const sendDeviceInfo = (deviceData) => api.post('/device/info', deviceData);
export const getCurrentDeviceInfo = () => api.get('/device/current');

export default api;