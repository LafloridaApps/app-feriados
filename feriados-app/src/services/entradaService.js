import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: BASE_URL

});

export const saveEntrada = async (entrada) => {
  const { data } = await api.post('/entrada', entrada);
  return data;
};
