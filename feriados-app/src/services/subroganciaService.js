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
  
};

export const saveSubrogancia = async (subrogancia) => {
    try {
        const response = await axios.post(`${BASE_URL}/solicitudes/subrogancia/create`, subrogancia);
        return response;
    } catch (error) {
        console.error("Error al guardar la subrogancia:", error);
        // Re-lanzamos el error para que el componente que llama pueda manejarlo.
        throw error;
    }
};
