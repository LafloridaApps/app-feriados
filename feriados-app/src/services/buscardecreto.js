import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/decretos';

const api = axios.create({
  baseURL: BASE_URL
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
