import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/derivacion';

export const inboxSolicitudesByRut = async (rut) => {
    try {
        const response = await axios.get(`${BASE_URL}/${rut}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
