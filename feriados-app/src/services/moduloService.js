
import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/modulos`

});

export const listarModulos = async () => {
    try {
        const { data } = await api.get('listar')
        return data;
    } catch (error) {
        console.log(error)
        throw error
    }
}