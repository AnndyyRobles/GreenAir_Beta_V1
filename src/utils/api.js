import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRegions = async () => {
  try {
    const response = await api.get('/regions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};

export const getStationData = async (id) => {
  try {
    const [station, measurements, weather, alerts] = await Promise.all([
      api.get(`/stations/${id}/`),
      api.get(`/measurements/?station=${id}`),
      api.get(`/weather/?station=${id}`),
      api.get(`/alerts/?station=${id}`)
    ]);

    return {
      ...station.data,
      measurements: measurements.data,
      weather: weather.data[0],
      alerts: alerts.data
    };
  } catch (error) {
    console.error('Error fetching station data:', error);
    return null;
  }
};

export const subscribeToStation = async (stationId) => {
  try {
    const response = await api.post(`/stations/${stationId}/subscribe/`);
    return response.data;
  } catch (error) {
    console.error('Error subscribing to station:', error);
    throw error;
  }
};