import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/usuarios`

});

export const listarUsuarios = async () => {

    try {
        const { data } = await api.get('/list');
        return data;

    } catch (error) {
        console.log(error)
        throw error;

    }
}

export const guardarUsuario = async (usuario) => {

    try {
        const response = await api.post('/crear-o-actualizar', usuario)
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getPermisosByUsuario = async (rut) => {

    try {
        const { data } = await api.get(`/${rut}`);
        return data;
    } catch (error) {
        console.log / (error)
        throw error
    }
}