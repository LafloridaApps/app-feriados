import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/api/derivacion`

});

export const saveDerivacion = async (idDerivacion, rut) => {
    try {
        const { data } = await api.post('/derivar', null, {
            params: { idDerivacion, rut }
        });
        return data;
    } catch (error) {
        console.error('Error al grabar la derivacion:', error);
        throw error;
    }
};
