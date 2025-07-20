import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/solicitudes';

const api = axios.create({
    baseURL: BASE_URL,

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

export const getSolicitudByFechaAndTipo = async (rut, fechaInicio, tipo) => {
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
