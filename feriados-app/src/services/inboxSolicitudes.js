import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/api/derivacion`

});


export const getInboxSolicitudesByDepto = async (codDepto,pageNumber) => {
    try {
        const { data } = await api.get(`departamento/${codDepto}/${pageNumber}`);
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
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