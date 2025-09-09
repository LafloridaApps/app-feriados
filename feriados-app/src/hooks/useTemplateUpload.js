import { useState } from 'react';
import Swal from 'sweetalert2';
import { uploadFileTemplate } from '../services/templateService';

export const useTemplateUpload = (onUploadSuccess) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [nombrePlantilla, setNombrePlantilla] = useState('');
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.docx')) {
            setSelectedFile(file);
            setFeedbackMessage('');
        } else {
            setSelectedFile(null);
            setFeedbackMessage('Por favor, selecciona un archivo .docx');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !nombrePlantilla) {
            setFeedbackMessage("Por favor, ingresa el nombre de la plantilla y selecciona un archivo.");
            return;
        }

        Swal.fire({
            title: "Subiendo Plantilla",
            text: "Por favor, espera...",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const response = await uploadFileTemplate(selectedFile, nombrePlantilla);
            Swal.close();
            Swal.fire({
                icon: "success",
                title: "Plantilla subida",
                text: response.message,
            });

            setSelectedFile(null);
            setNombrePlantilla('');
            setFileInputKey(Date.now());
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error al subir",
                text: "No se pudo subir la plantilla. Intenta nuevamente.",
            });
            console.error("Error al subir plantilla:", error);
        }
    };

    return {
        selectedFile,
        feedbackMessage,
        nombrePlantilla,
        fileInputKey,
        setNombrePlantilla,
        handleFileChange,
        handleUpload,
    };
};
