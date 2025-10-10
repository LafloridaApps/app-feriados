import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/solicitudes/decretos`
});

export const searchDecretos = async (filters, page = 0, size = 10) => {
    try {
        const params = { ...filters, page, size };
        console.log('Enviando filtros a la API (con paginación):', params);
        const response = await api.get('/search', { params });
        console.log('Respuesta de la API (paginada):', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al buscar decretos:', error);
        throw error;
    }
};