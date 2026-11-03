import axios from 'axios';
import { BASE_URL } from './url';

const api = axios.create({ baseURL: `${BASE_URL}/solicitudes/terceros` });

export const obtenerSolicitanteDireccion = async (rutGestor, rut) => {
    const { data } = await api.get('/funcionario', { params: { rutGestor, rut } });
    return data;
};

export const buscarSolicitantesDireccion = async (rutGestor, pattern, pageNumber = 0) => {
    const { data } = await api.get('/buscar-nombre', { params: { rutGestor, pattern, pageNumber } });
    return data;
};
