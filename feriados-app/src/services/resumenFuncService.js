import axios from "axios";
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/funcionario`
})

export const getResumenInicioByRut = async (rut, ) => {
    try {
        const { data } = await api.get('/resumen-inicio', { params: { rut } });
        return data;
    } catch (error) {
        console.log(error)
        throw error;
    }

}
