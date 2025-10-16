import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/solicitudes`
});

export const getInfoFirma = async (rut) => {
    try {
        const response = await api.get(`consulta-firma`,{params : {rut}});
        
        return response.data;
    } catch (error) {
        console.error('Error al obtener la informacion de la firma:', error);
        throw error;
    }
};
