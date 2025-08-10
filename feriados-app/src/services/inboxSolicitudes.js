import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/derivacion';

const api = axios.create({
    baseURL: BASE_URL

});


export const getInboxSolicitudesByDepto = async (codDepto,pageNumber) => {
    try {
        const { data } = await api.get(`departamento/${codDepto}/${pageNumber}`);
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
