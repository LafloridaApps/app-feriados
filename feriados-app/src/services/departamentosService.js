import axios from 'axios';

// URL base (puede venir de env si prefieres)
const BASE_URL = 'http://localhost:8082/api/departamentos';

export const getDepartamentosList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/list`);
    return response
  } catch (error) {
    console.error('Error al obtener los departamentos:', error);
    throw error;
  }
};

export const updateDepartamento = async (id, nuevoNombre) => {
  try {
    const response = await axios.put(`${BASE_URL}?idDepto=${id}`, { nombre: nuevoNombre });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el departamento:', error);
    throw error;
  }
}

export const upddateJefeDepto = async (id, nuevoRut) => {
  try {
    const response = await axios.put(`${BASE_URL}/jefe?idDepto=${id}`, { rut: nuevoRut });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el departamento:', error);
    throw error;
  }
}
