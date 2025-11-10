import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/funcionario/cargofunc`

});

export const searchIsJefeByCodDeptoAndRut = async (codDepto, rut) => {

    try {
        const { data } = await api.get('', {
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


