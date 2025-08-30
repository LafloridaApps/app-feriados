import axios from 'axios';
import { head } from 'lodash';

const BASE_URL = 'http://localhost:8082/api/decretos';

const api = axios.create({
    baseURL: BASE_URL

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
