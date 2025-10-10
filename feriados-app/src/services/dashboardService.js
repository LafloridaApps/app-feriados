import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/dashboard`,
});

export const getUpcomingAbsencesByDepto = async (codDepto) => {
    try {
        const { data } = await api.get(`/proximas-ausencias/${codDepto}`);
        return data;
    } catch (error) {
        console.error('Error al obtener las próximas ausencias:', error);
        throw error;
    }
};

export const getTodayAbsencesByDepto = async (codDepto) => {
    try {
        const { data } = await api.get(`/ausencias-hoy/${codDepto}`);
        return data;
    } catch (error) {
        console.error('Error al obtener las ausencias de hoy:', error);
        throw error;
    }
};

export const getJefeDashboardSummary = async (rutJefe, idDepartamento) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/resumen/jefe-departamento`, {
            params: {
                rutJefe,
                idDepartamento
            }
        });
        return data;
    } catch (error) {
        console.error('Error al obtener el resumen del dashboard del jefe:', error);
        throw error;
    }
};

export const getDashboardSummary = async (idDepto, fecha) => {
    try {
        const { data } = await api.get(`/ausencias/departamento`,{params:{idDepto,fecha}});
        return data;
    } catch (error) {
        console.error('Error al obtener las ausencias de hoy:', error);
        throw error;
    }
};