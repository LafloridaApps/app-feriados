import axios from 'axios';

const API_URL = 'http://localhost:8082/api/decretos'; // Ajusta la URL base de tu API

export const searchDecretos = async (filters, pageable) => {
    try {
        const params = {
            ...filters,
            page: pageable.page,
            size: pageable.size,
            sort: pageable.sort
        };
        console.log('Enviando filtros a la API:', params); // <-- Nuevo console.log
        const response = await axios.get(`${API_URL}/search`, { params });
        console.log('Respuesta de la API:', response.data); // <-- Nuevo console.log
        return response.data;
    } catch (error) {
        console.error('Error al buscar decretos:', error);
        throw error;
    }
};
