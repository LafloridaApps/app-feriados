import axios from "axios";
import { BASE_URL } from './url.js';

const api = axios.create({
    baseURL: `${BASE_URL}/solicitudes/funcionario`,
   
});

export const subroganciaService = {
  buscarPorRut: async (rut, fechaInicio, fechaFin) => {
    const response = await api.get("/subrogante-rut", {
      params: { rut,fechaInicio, fechaFin }
    });
    return response.data;
  },
  buscarPorNombre: async (nombre,fechaInicio,fechaFin,pageNumber, idDepto) => {
    try {
        const response = await api.get("/subrogante-nombre", {
            params: { nombre, fechaInicio, fechaFin, pageNumber, idDepto }
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar por nombre:", error);
        throw error;
    }
  },
  buscarSubroganciasExistentes: async ({ rutJefe, subrogante, idDepto }) => {
    try {
        const params = {};
        if (rutJefe)    params.rutJefe    = rutJefe;
        if (subrogante) params.subrogante = subrogante;
        if (idDepto)    params.idDepto    = idDepto;

        const response = await axios.get(`${BASE_URL}/solicitudes/subrogancia/search`, { params });
        return response.data;
    } catch (error) {
        console.error("Error al buscar subrogancias existentes:", error);
        throw error;
    }
  },
  
};

export const saveSubrogancia = async (subrogancia) => {
    try {
        const response = await axios.post(`${BASE_URL}/solicitudes/subrogancia/create`, subrogancia);
        return response;
    } catch (error) {
        console.error("Error al guardar la subrogancia:", error);
        throw error;
    }
};

export const updateSubrogancia = async (id, subrogancia) => {
    try {
        const response = await axios.put(`${BASE_URL}/solicitudes/subrogancia/update/${id}`, subrogancia);
        return response;
    } catch (error) {
        console.error("Error al actualizar la subrogancia:", error);
        throw error;
    }
};

export const deleteSubrogancia = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/solicitudes/subrogancia/${id}/delete`);
        return response;
    } catch (error) {
        console.error("Error al eliminar la subrogancia:", error);
        throw error;
    }
};

