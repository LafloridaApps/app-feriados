import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/solicitudes/decretos`
});

export const decretar = async (decretos) => {
  try {
    const url = `${api.defaults.baseURL}/decretar`;
    console.log('[decretar] URL:', url);
    console.log('[decretar] Request body:', JSON.stringify(decretos));
    const { data } = await api.post('/decretar', decretos);
    console.log('[decretar] Response:', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('[decretar] Error - URL:', `${api.defaults.baseURL}/decretar`);
    console.error('[decretar] Error - Request:', JSON.stringify(decretos));
    console.error('[decretar] Error - Response:', error.response?.data || error.message);
    throw error;
  }
};

