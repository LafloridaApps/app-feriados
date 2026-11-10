import axios from 'axios';
import { BASE_URL } from './url.js';
const api = axios.create({ baseURL: `${BASE_URL}/solicitudes/modulos` });
export const listarModulos = async () => (await api.get('/listar')).data;
export const crearModulo = async modulo => (await api.post('/crear', modulo)).data;

export const listarModulosPagina = async params => (await api.get('/pagina', { params })).data;
