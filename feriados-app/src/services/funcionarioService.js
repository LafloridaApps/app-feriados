import axios from 'axios';
import Swal from 'sweetalert2';

const BASE_URL = 'http://localhost:8082/api/funcionario';

const api = axios.create({
    baseURL: BASE_URL

});

export const getFuncionarioByRut = async (rut, vRut) => {
    try {
        const { data } = await api.get('', { params: { rut, vRut } });
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};

export const getFuncionarioLocalByRut = async (rut) => {
    const response = await axios.get(`${BASE_URL}?rut=${rut}`);
    return response;
};


export const searchFuncionarioByNombreAndDepto = async (id, nombre) => {

    try {
        const { data } = await api.get("/buscar", { params: { id, nombre } });
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};


export const getDireccionByIdDepto = async (id, fechaInicio, fechaFin) => {

    try {
        const { data } = await api.get("/buscar-director", { params: { id, fechaInicio, fechaFin } });
        return data;
    } catch (error) {
       Swal.fire({
            icon: 'error',
            title: 'Error al obtener funcionario',
            text: error.response.data.mensaje,
        });
        return;
    }
};





