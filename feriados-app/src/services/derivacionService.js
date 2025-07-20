import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/derivacion/derivar';

const api = axios.create({
    baseURL: BASE_URL

});

export const saveDerivacion = async (id) => {
    try {
        const { data } = await api.post(`/${id}`);
        return data;
    } catch (error) {
        console.error('Error al grabar la derivacion:', error);
        throw error;
    }
};
