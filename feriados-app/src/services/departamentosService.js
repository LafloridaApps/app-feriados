import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/departamentos';

const api = axios.create({
  baseURL: BASE_URL

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

export const updateDepartamento = async (id, nuevoNombre) => {
  try {
    const { data } = await api.put('', { nombre: nuevoNombre }, {
      params: { idDepto: id }
    });
    return data;
  } catch (error) {
    console.error('Error al actualizar el departamento:', error);
    throw error;
  }
};

export const updateJefeDepto = async (id, nuevoRut) => {
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