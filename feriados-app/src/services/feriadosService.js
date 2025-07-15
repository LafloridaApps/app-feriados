import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/feriados';

export const getFeriadosByRut = async (rut, ident) => {
    try {
        const response = await axios.get(`${BASE_URL}?rut=${rut}&ident=${ident}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
