import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/dashboard';
const RESUMEN_JEFE_URL = 'http://localhost:8082/api/resumen/jefe-departamento';

const api = axios.create({
    baseURL: BASE_URL,
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
        const { data } = await axios.get(RESUMEN_JEFE_URL, {
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
