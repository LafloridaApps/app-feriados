import axios from "axios";



const api = axios.create({
    baseURL: 'http://localhost:8082/api/solicitudes/'
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