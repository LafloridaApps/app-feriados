import axios from 'axios';
import { BASE_URL } from './url';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/subrogancia/integracion`,
});

export const obtenerEstadoCeroPapel = async () => {
    const { data } = await api.get('/estado');
    return data;
};

export const obtenerConfiguracionCeroPapel = async (rutGestor) => {
    const { data } = await api.get('/configuracion', { params: { rutGestor } });
    return data;
};

export const guardarConfiguracionCeroPapel = async (configuracion, rutGestor) => {
    const { data } = await api.put('/configuracion', configuracion, {
        headers: { 'X-CeroPapel-Config': '1' },
        params: { rutGestor },
    });
    return data;
};

export const obtenerValoresInicialesCeroPapel = async () => {
    const { data } = await api.get('/valores-iniciales');
    return data;
};

export const revelarClaveCeroPapel = async (rutGestor) => {
    const { data } = await api.post('/clave', null, {
        headers: { 'X-CeroPapel-Config': '1' },
        params: { rutGestor },
    });
    return data;
};
