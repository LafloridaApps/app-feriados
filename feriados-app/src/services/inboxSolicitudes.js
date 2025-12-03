import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/derivacion`

});


export const getInboxSolicitudesByDepto = async (codDepto, pageNumber, rut, filtros = {}) => {
    try {
        const { noLeidas } = filtros;
        const params = new URLSearchParams();
        params.append('rut', rut);

        if (noLeidas) {
            params.append('noLeidas', 'true');
        }

        const url = `departamento/${codDepto}/page/${pageNumber}`;

        const { data } = await api.get(url, { params });
        return data;
    } catch (error) {
        console.error('Error al obtener las solicitudes del inbox:', error);
        throw error;
    }
};


export const getSolicitudesNoLeidas = async (codDepto) => {
    try {
        const { data } = await api.get(`no-leidas/${codDepto}`);
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};

export const marcarSolicitudComoLeida = async (id) => {
    try {
        const { data } = await api.put(`marcar-leida/${id}`);
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};