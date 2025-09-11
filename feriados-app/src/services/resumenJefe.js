import axios from 'axios';

const API_URL = 'http://localhost:8082/api/resumen/jefe-departamento';

export const getResumenJefe = async (rutJefe, idDepartamento) => {
    console.log(rutJefe, idDepartamento)
    try {
        const { data } = await axios.get(API_URL, {
            params: {
                rutJefe,
                idDepartamento
            }
        });
        return data;
    } catch (error) {
        console.error('Error al obtener el resumen del jefe:', error);
        throw error;
    }
};