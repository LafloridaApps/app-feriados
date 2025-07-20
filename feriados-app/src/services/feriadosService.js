import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/feriados';

const api = axios.create({
    baseURL: BASE_URL

});

export const getFeriadosByRut = async (rut, ident) => {
    try {
        const { data } = await api.get('', { params: { rut, ident } });
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
