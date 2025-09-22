import axios from "axios";
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/api/funcionario`
})

export const getResumenInicioByRut = async (rut, page, size) => {
    try {
        const { data } = await api.get('/resumen-inicio', { params: { rut } });
        return data;
    } catch (error) {
        throw error;
    }

}
