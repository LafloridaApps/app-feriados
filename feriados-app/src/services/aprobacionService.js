import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/aprobaciones';

const api = axios.create({
  baseURL: BASE_URL
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
