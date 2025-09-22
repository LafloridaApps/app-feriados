import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/api`

});

export const saveEntrada = async (entrada) => {
  const { data } = await api.post('/entrada', entrada);
  return data;
};
