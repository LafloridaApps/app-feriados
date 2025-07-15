import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/aprobaciones';

export const saveAprobacion = async (aprobacion) => {
  try {
    const response = await axios.post(`${BASE_URL}`,aprobacion);
    return response.data;
  } catch (error) {
    console.error('Error al grabar la derivacion:', error);
    throw error;
  }
};
