import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/solicitudes/decretos`
});

export const getDocDecreto = async (id) => {
  try {
    const response = await api.get(`/documento`, { 
      params: { id }, 
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error al descargar el documento Word:', error);
    throw error;
  }
};

export const getExcelDecreto = async (id) => {
  try {
    const response = await api.get(`/excel`, {
      params: { id },
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error al descargar el documento Excel:', error);
    throw error;
  }
};
