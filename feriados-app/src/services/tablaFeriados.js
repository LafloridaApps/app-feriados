import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/tablaferiados`,

});

export const getTablaFeriados = async () => {
    try {
        const { data} = await api.get('/all');
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
