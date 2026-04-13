import axios from 'axios';
const BASE = 'http://localhost:8000/api/bridge';
export const getLocationData = () => axios.get(`${BASE}/location-data/`);
export const validateGeometry = (data) => axios.post(`${BASE}/validate-geometry/`, data);
export const validateGirderGeometry = (data) => axios.post(`${BASE}/validate-girder-geometry/`, data);
