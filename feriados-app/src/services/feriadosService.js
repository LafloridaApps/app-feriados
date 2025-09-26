import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/feriados`

});

export const getFeriadosByRutAndIdent = async (rut, ident) => {
    try {
        const { data } = await api.get('', { params: { rut, ident } });
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
