import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/solicitudes`,
});

/**
 * Anula el envío de una solicitud pendiente.
 * Solo tendrá efecto si el destinatario aún no la ha recepcionado.
 * POST /solicitudes/solicitudes/anular
 * @param {number|string} idSolicitud
 * @param {string} motivo
 */
export const anularSolicitud = async (idSolicitud, motivo) => {
    try {
        const { data } = await api.post('/anular', null, { params: { idSolicitud, motivo } });
        return data;
    } catch (error) {
        console.error('Error al anular solicitud:', error);
        throw error;
    }
};

/**
 * Aprueba o rechaza una solicitud de anulación pendiente.
 * POST /solicitudes/solicitudes/aprobar-anulacion
 * @param {number|string} idSolicitud
 * @param {number|string} rutAprobador
 * @param {boolean} aprueba
 */
export const resolverAnulacion = async (idSolicitud, rutAprobador, aprueba) => {
    try {
        const { data } = await api.post('/aprobar-anulacion', null, {
            params: {
                idSolicitud,
                rutAprobador: parseInt(rutAprobador, 10),
                aprueba,
            },
        });
        return data;
    } catch (error) {
        console.error('Error al resolver anulación:', error);
        throw error;
    }
};
