import axios from 'axios';
import { BASE_URL } from './url.js';

const api = axios.create({
  baseURL: `${BASE_URL}/solicitudes/departamentos`
});

export const getDepartamentosList = async () => {
  try {
    const response = await api.get(`/list`);
    return response
  } catch (error) {
    console.error('Error al obtener los departamentos:', error);
    throw error;
  }
};

export const updateDepartamentoById = async (id, deptoData) => {
  try {
    const { data } = await api.put('', deptoData, {
      params: { idDepto: id }
    });
    return data;
  } catch (error) {
    console.error('Error al actualizar el departamento:', error);
    throw error;
  }
};

export const updateJefeDeptoById = async (id, nuevoRut) => {
  try {
    const { data } = await api.put('/jefe', { rut: nuevoRut }, {
      params: { idDepto: id }
    });
    return data;
  } catch (error) {
    console.error('Error al actualizar el jefe del departamento:', error);
    throw error;
  }
};

export const createDepartamento = async (deptoData) => {
  try {
    const { data } = await api.post('', deptoData);
    return data;
  } catch (error) {
    console.error('Error al crear el departamento:', error);
    throw error;
  }
};
