import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Function to get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Set the auth token for all requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Properties API calls
export const getProperties = () => api.get('/properties');
export const getProperty = (id) => api.get(`/properties/${id}`);
export const createProperty = (data) => api.post('/properties', data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);

// Leads API calls
export const getLeads = () => api.get('/leads');
export const createLead = (data) => api.post('/leads', data);
export const updateLead = (id, data) => api.put(`/leads/${id}`, data);
export const deleteLead = (id) => api.delete(`/leads/${id}`);
export const replyToLead = (id, message) => api.post(`/leads/${id}/reply`, { message });

// Tasks API calls
export const getTasks = () => api.get('/tasks');
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Appointments API calls
export const getAppointments = () => api.get('/appointments');
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointmentStatus = (id, status) => api.put(`/appointments/${id}/status`, { status });
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

// Documents API calls
export const getDocuments = (property_id) => api.get('/documents', { params: { property_id } });
export const uploadDocument = (formData) => api.post('/documents/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteDocument = (id) => api.delete(`/documents/${id}`);

export default api;
