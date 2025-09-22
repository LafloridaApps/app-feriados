import axios from 'axios';
import { BASE_URL } from './url.js';

export const getResumenJefe = async (rutJefe, idDepartamento) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/resumen/jefe-departamento`, {
            params: {
                rutJefe,
                idDepartamento
            }
        });
        return data;
    } catch (error) {
        console.error('Error al obtener el resumen del jefe:', error);
        throw error;
    }
};
