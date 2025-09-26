import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/solicitudes/aprobaciones`
});

export const saveAprobacion = async (aprobacion) => {
  try {
    const { data } = await api.post('', aprobacion);
    return data;
  } catch (error) {
    console.error('Error al grabar la derivacion:', error);
    throw error;
  }
};
