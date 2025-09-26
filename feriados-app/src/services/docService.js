import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/solicitudes/decretos`
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
