import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/derivacion';

const api = axios.create({
    baseURL: BASE_URL

});


export const getInboxSolicitudesByRut = async (rut) => {
    try {
        const { data } = await api.get(`/${rut}`);
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
