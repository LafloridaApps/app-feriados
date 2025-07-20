import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/tablaferiados';

const api = axios.create({
    baseURL: BASE_URL,

});

export const getTablaFeriados = async () => {
    try {
        const { data} = await api.get('/all');
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};
