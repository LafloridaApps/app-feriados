import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/departamentos/esjefe';

export const getIsJefe = async (codEx, rut) => {
    try {
        const response = await axios.get(`${BASE_URL}?codEx=${codEx}&rut=${rut}`);
        return response;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
