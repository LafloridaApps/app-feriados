import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8082/api/funcionario'
})

export const getResumenInicioByRut = async (rut, page, size) => {
    try {
        const { data } = await api.get('/resumen-inicio', { params: { rut } });
        return data;
    } catch (error) {
        throw error;
    }

}