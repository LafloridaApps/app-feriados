import axios from 'axios';

const BASE_URL = 'http://localhost:8082/api/agendalc/doc';

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
