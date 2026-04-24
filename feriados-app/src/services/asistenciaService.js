import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/funcionario/asistencia`
});

/**
 * Obtiene el registro de asistencia de un funcionario.
 * @param {string} rut - RUT del funcionario.
 * @param {number|string} ident - Identificador del funcionario.
 * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD.
 * @param {string} fechaFin - Fecha de fin en formato YYYY-MM-DD.
 * @returns {Promise<Array>} - Lista de registros de asistencia.
 */
export const getAsistencia = async (rut, ident, fechaInicio, fechaFin) => {
    try {
        const { data } = await api.get('', {
            params: {
                rut,
                ident,
                fechaInicio,
                fechaFin
            }
        });
        return data;
    } catch (error) {
        console.error('Error al obtener asistencia:', error);
        throw error;
    }
};
