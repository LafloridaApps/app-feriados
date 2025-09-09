import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/decretos';

const api = axios.create({
  baseURL: BASE_URL
});

export const getDocDecreto = async (id) => {
  try {
    const response = await api.get(`/documento`, { 
      params: { id }, 
      responseType: 'blob', // Important for file downloads
    });
    return response;
  } catch (error) {
    console.error('Error al descargar el documento Word:', error);
    throw error;
  }
};
