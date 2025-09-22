import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/api/postergaciones`

});

export const savePostergacion = async (postergacion) => {
    try {
        console.log(postergacion);
        const { data } = await api.post('/crear', postergacion);
        return data;
    } catch (error) {
        console.error('Error al guardar la postergacion:', error);
        throw error;
    }
};