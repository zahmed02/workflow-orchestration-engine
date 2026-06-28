import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance for authenticated API calls
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ---------- Auth Endpoints ----------
export const login = (username, password) =>
  axios.post(`${API_URL}/auth/login`, { username, password });

export const register = (username, password) =>
  axios.post(`${API_URL}/auth/register`, { username, password });

// ---------- Tasks ----------
export const getTasks = (params) => api.get('/tasks', { params });
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const undoTask = (id) => api.post(`/tasks/${id}/undo`);

// ---------- Workflows ----------
export const getWorkflows = () => api.get('/workflows');
export const getWorkflow = (id) => api.get(`/workflows/${id}`);
export const createWorkflow = (data) => api.post('/workflows', data);
export const deleteWorkflow = (id) => api.delete(`/workflows/${id}`);
export const executeWorkflow = (id) => api.post(`/workflows/${id}/execute`);

// ---------- Resources ----------
export const getResources = () => api.get('/resources');
export const createResource = (resource) => api.post('/resources', resource);
export const updateResource = (id, resource) => api.put(`/resources/${id}`, resource);
export const deleteResource = (id) => api.delete(`/resources/${id}`);

// ---------- Templates ----------
export const getTemplates = () => api.get('/workflows/templates');
export const saveTemplate = (name, workflow) => api.post(`/workflows/templates/${name}`, workflow);
export const getTemplate = (name) => api.get(`/workflows/templates/${name}`);
export const deleteTemplate = (name) => api.delete(`/workflows/templates/${name}`);

// ---------- Undo History ----------
export const getUndoHistory = () => api.get('/undo/history');

// ---------- Execution Logs ----------
export const getRecentLogs = () => api.get('/logs/recent');

// ---------- Device Info ----------
export const sendDeviceInfo = (deviceData) => api.post('/device/info', deviceData);
export const getCurrentDeviceInfo = () => api.get('/device/current');

export default api;