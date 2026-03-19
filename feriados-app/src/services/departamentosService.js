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
    const { data } = await api.put(`/${id}?rut=${nuevoRut}`);
    return data;
  } catch (error) {
    console.error('Error al actualizar el jefe del departamento:', error);
    throw error;
  }
};

export const updateNombreDeptoById = async (id, nuevoNombre) => {
  try {
    const { data } = await api.put(`/${id}/nombre?nombre=${nuevoNombre}`);
    return data;
  } catch (error) {
    console.error('Error al actualizar el nombre del departamento:', error);
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

export const getDepartamentosExterno = async () => {
  try {
    const { data } = await api.get(`/list-externo`);
    return data;
  } catch (error) {
    console.error('Error al obtener los departamentos externos:', error);
    throw error;
  }
};

export const updateCodigoExterno = async (id, codigoExterno) => {
  try {
    const { data } = await api.put(`/${id}/codex?codEx=${codigoExterno}`);
    return data;
  } catch (error) {
    console.error('Error al actualizar el código externo:', error);
    throw error;
  }
};

export const deleteCodigoExternoByIdDepto = async (id) => {
  try {
    const { data } = await api.delete(`/${id}/codex`);
    return data;
  } catch (error) {
    console.error('Error al eliminar el código externo:', error);
    throw error;
  }
};

export const agregarDepartamento = async (deptoData) => {
  try {
    const { data } = await api.post('/add', deptoData);
    return data;
  } catch (error) {
    console.error('Error al agregar el departamento:', error);
    throw error;
  }
};