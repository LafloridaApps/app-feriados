import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/postergaciones';

const api = axios.create({
    baseURL: BASE_URL

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