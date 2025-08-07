import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/funcionario/cargofunc';

const api = axios.create({
    baseURL: BASE_URL

});

export const searchIsJefeByCodDeptoAndRut = async (codDepto, rut) => {
    
    try {
        const {data} = await api.get(BASE_URL, {
            params: {
                codDepto: codDepto,
                rut: rut
            }
        })
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};


