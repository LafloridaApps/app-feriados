import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/api/decretos`
});

export const decretar = async (decretos) => {
  try {
    const { data } = await api.post('/decretar', decretos);
    return data;
  } catch (error) {
    console.error('Error al generar el decreto:', error);
    throw error;
  }
};

