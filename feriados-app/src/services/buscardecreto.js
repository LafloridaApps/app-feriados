import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/solicitudes/decretos`
});


export const getDecretosBetweenDates = async (fechaInicio, fechaFin) => {
  try {

    const { data } = await api.get('/entre-fechas', {
      params: {
        fechaInicio,
        fechaFin,
      },
    });


    return data;

  } catch (error) {
    console.error('Error al obtener decretos generados:', error);
    throw error;
  }
};
