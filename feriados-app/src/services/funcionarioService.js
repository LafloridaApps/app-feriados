import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/funcionario';

export const getFuncionarioByRut = async (rut) => {
    try {
        const response = await axios.get(`${BASE_URL}/${rut}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};

export const getFuncionarioLocalByRut = async (rut) => {
    const response = await axios.get(`${BASE_URL}/local/${rut}`);
    return response;
};
