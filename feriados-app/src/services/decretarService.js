import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/decretos';

const api = axios.create({
  baseURL: BASE_URL
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

