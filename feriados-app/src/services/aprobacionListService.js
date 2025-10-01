import axios from 'axios';
import { BASE_URL } from './url.js';


const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/aprobaciones`

});

export const getAprobacionesBetweenDates = async (fechaInicio, fechaFin, pageNumber) => {
    try {
        const { data } = await api.get('/list', { params: { fechaInicio, fechaFin, pageNumber } });
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
