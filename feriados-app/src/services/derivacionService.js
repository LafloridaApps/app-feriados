import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/derivacion/derivar';

export const saveDerivacion = async (id) => {
    try {
        const response = await axios.post(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al grabar la derivacion:', error);
        throw error;
    }
};
