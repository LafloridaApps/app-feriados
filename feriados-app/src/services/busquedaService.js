import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: BASE_URL,
});

export const buscarSolicitudes = async (codDepto, params = {}) => {
    try {
        const { nombreSolicitante, rutSolicitante, fechaInicio, fechaTermino, pageNumber } = params;
        const queryParams = new URLSearchParams();
        queryParams.append('codDepto', codDepto);

        if (nombreSolicitante) queryParams.append('nombreSolicitante', nombreSolicitante);
        if (rutSolicitante) queryParams.append('rutSolicitante', rutSolicitante);
        if (fechaInicio) queryParams.append('fechaInicio', fechaInicio);
        if (fechaTermino) queryParams.append('fechaTermino', fechaTermino);
        if (pageNumber !== undefined && pageNumber !== null) queryParams.append('pageNumber', pageNumber);

        const { data } = await api.get('/solicitudes/busqueda', { params: queryParams });
        return data;
    } catch (error) {
        console.error('Error al buscar solicitudes:', error);
        throw error;
    }
};
