import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/solicitudes`,

});

export const saveSolicitud = async (solicitud) => {
    try {
        const { data } = await api.post('/crear', solicitud);
        return data;
    } catch (error) {
        console.error('Error al guardar la solicitud:', error);
        throw error;
    }
};

export const getSolicitudByFechaInicioAndTipo = async (rut, fechaInicio, tipo) => {
    try {
        const { data } = await api.get('/existe', {
            params: { rut, fechaInicio, tipo }
        });
        return data;
    } catch (error) {
        console.error('Error al obtener la solicitud:', error);
        throw error;
    }
};
