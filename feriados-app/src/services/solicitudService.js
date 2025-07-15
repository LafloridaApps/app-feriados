import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/solicitudes/crear';

export const saveSolicitud = async (solicitud) => {
    try {
        const response = await axios.post(BASE_URL, solicitud);
        return response.data;
    } catch (error) {
        console.error('Error al guardar la solicitud:', error);
        throw error;
    }
};
