import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/solicitudes/decretos`
});

export const searchDecretos = async (filters, pageable) => {
    try {
        const params = {
            ...filters,
            page: pageable.page,
            size: pageable.size,
            sort: pageable.sort
        };
        console.log('Enviando filtros a la API:', params); // <-- Nuevo console.log
        const response = await api.get('/search', { params });
        console.log('Respuesta de la API:', response.data); // <-- Nuevo console.log
        return response.data;
    } catch (error) {
        console.error('Error al buscar decretos:', error);
        throw error;
    }
};