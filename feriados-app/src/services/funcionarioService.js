import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/api/funcionario`

});

export const getFuncionarioByRutAndVrut = async (rut) => {
    try {
        const { data } = await api.get('', { params: { rut } });
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};

export const getFuncionarioLocalByRut = async (rut) => {
    const response = await api.get('', { params: { rut } });
    return response;
};


export const searchFuncionarioByNombreAndDepto = async (id, nombre, fechaInicio, fechaFin) => {

    try {
        const { data } = await api.get("/buscar", { params: { id, nombre, fechaInicio, fechaFin } });
        return data;
    } catch (error) {
        console.error('Error al obtener funcionario:', error);
        throw error;
    }
};


export const searchDirectorByDeptoAndFechaInicioAndFechaFinSolicitud = async (id, fechaInicio, fechaFin) => {

    try {
        const { data } = await api.get("/director-activo", { params: { id, fechaInicio, fechaFin } });
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





