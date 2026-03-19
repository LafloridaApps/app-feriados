import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/funcionario`
});

export const getFotoFuncionario = async (rut) => {
    try {
        const { data } = await api.get(`/foto/${rut}`);
        return data;
    } catch (error) {
        console.error('Error al obtener la foto del funcionario:', error);
        throw error;
    }
};