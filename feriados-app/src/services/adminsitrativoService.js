import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/administrativos';

export const getAdministrativoByRut = async (rut, ident) => {
  try {
    const response = await axios.get(`${BASE_URL}?rut=${rut}&ident=${ident}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener funcionario:', error);
    throw error;
  }
};
