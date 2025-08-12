import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/derivacion';

const api = axios.create({
    baseURL: BASE_URL

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
