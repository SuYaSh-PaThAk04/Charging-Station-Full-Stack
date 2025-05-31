import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api',
});


export const fetchChargers = () => API.get('/chargers');
export const createCharger = (data) => API.post('/chargers', data);
export const updateCharger = (id, data) => API.put(`/chargers/${id}`, data);
export const deleteCharger = (id) => API.delete(`/chargers/${id}`);
