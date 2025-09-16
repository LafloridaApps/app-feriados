import axios from 'axios';


const BASE_URL = 'http://localhost:8082/api/aprobaciones';

const api = axios.create({
    baseURL: BASE_URL

});

export const getAprobacionesBetweenDates = async (fechaInicio, fechaFin) => {
    try {
        const { data } = await api.get('/list', { params: { fechaInicio, fechaFin } });
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
