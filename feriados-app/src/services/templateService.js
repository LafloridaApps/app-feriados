import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/doc';

const api = axios.create({
    baseURL: BASE_URL,

});

export const uploadFileTemplate = async (file, nombrePlantilla) => {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nombrePlantilla', nombrePlantilla);
    try {
        const { data } = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    } catch (error) {
        console.error(error.data);
        throw error;
    }
};

export const listTemplates = async () => {
    try {
        const { data } = await api.get('/templates');
        return data;
    } catch (error) {
        console.error(error.data);
        throw error;
    }
};

export const viewTemplate = async (filename) => {
    try {
        const response = await api.get(`/download/${filename}`, {
            responseType: 'blob', // Importante para manejar la respuesta como un archivo binario
        });
        return response.data;
    } catch (error) {
        console.error("Error al descargar el archivo:", error);
        throw error;
    }
};

export const deleteTemplate = async (id) => {
    try {
        const response = await api.delete('/delete', { params: { id } })
        return response.data;

    } catch (error) {
        console.error("Error al descargar el archivo:", error);
        throw error;
    }
};

