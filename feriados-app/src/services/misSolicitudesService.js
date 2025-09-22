import axios from "axios";
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/api/solicitudes/`
})

export const getSolicitudesByRut = async (rut, page, size) =>{
    try {
        const { data } = await api.get('/rut', { params: { rut, page, size } });
        return data;
    } catch (error) {
        console.log(error)
        throw error;
    }

}
