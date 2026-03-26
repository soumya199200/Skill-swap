import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

export const getSkills = () => API.get('/skills');
export const createSkill = (data) => API.post('/skills', data);
export const registerUser = (data) => API.post('/users/register', data);
export const getUserProfile = (id) => API.get(`/users/${id}`);
export const getUserByFirebaseUID = (firebaseUID) => API.get(`/users/firebase/${firebaseUID}`);
export const updateUserProfile = (id, data) => API.put(`/users/${id}`, data);
export const getUserCredits = (id) => API.get(`/users/${id}/credits`);
export const bookSession = (data) => API.post('/sessions/book', data);

export default API;
