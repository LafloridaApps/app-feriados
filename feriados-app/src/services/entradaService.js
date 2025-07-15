import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api';

export const saveEntrada = async (entrada) => {
  const response = await axios.post(`${BASE_URL}/entrada`, entrada);
  return response.data;
};
