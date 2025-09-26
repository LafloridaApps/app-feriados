import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/decretos`

});

export const eliminarDecretos = async (ids) => {
    try {
        const { data } = await api.delete('/eliminar',
           { data: { ids } }

        );
        return data;
    } catch (error) {
        console.error('Error al eliminar decretos:', error);
        throw error;
    }

};
