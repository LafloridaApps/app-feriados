import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/administrativos';

const api = axios.create({
  baseURL: BASE_URL,

});

export const getAdministrativoByRutAnIdent = async (rut, ident) => {
  try {
    const response = await api.get('', { params: { rut, ident } });
    return response.data;
  } catch (error) {
    console.error('Error al obtener funcionario:', error);
    throw error;
  }
};
