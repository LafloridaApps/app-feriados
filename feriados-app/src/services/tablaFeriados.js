import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/tablaferiados/all';

export const getTablaFeriados = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
