import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { uploadFileTemplate } from '../../../services/templateService';

const GestionDocumentos = () => {
    // Mocked state for existing templates


    const [selectedFile, setSelectedFile] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [nombrePlantilla, setNombrePlantilla] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.docx'))) {
            setSelectedFile(file);
            setFeedbackMessage('');
        } else {
            setSelectedFile(null);
            setFeedbackMessage('Por favor, selecciona un archivo .docx');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setFeedbackMessage("No hay ningún archivo seleccionado.");
            return;
        }

        let loadingSwal;
        try {
            // Mostrar loading
            loadingSwal = Swal.fire({
                title: "Subiendo Plantilla",
                text: "Por favor, espera mientras se sube la plantilla.",
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // Subida del archivo
            const response = await uploadFileTemplate(selectedFile, nombrePlantilla);

            // Cerrar loading antes de mostrar éxito
            Swal.close();

            Swal.fire({
                icon: "success",
                title: "Plantilla subida",
                text: `La plantilla "${response}" se subió con éxito.`,
                confirmButtonText: "Aceptar",
            });

            // Resetar formulario
            setSelectedFile(null);
            setNombrePlantilla("");
        } catch (error) {
            // Cerrar loading si ocurre error
            Swal.close();

            Swal.fire({
                icon: "error",
                title: "Error al subir",
                text: "No se pudo subir la plantilla. Intenta nuevamente.",
                confirmButtonText: "Aceptar",
            });

            console.error("Error al subir plantilla:", error);
        }
    };


    return (
        <div className="card shadow-sm">
            <div className="card-header">
                <h3>Gestión de Plantillas de Decretos</h3>
            </div>
            <div className="card-body">
                <div className="mb-4 p-3 border rounded">
                    <h5 className="mb-3">Subir Nueva Plantilla</h5>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de la Plantilla"
                            onChange={(e) => setNombrePlantilla(e.target.value)}

                        />
                        <input
                            type="file"
                            className="form-control"
                            accept=".docx"
                            onChange={handleFileChange}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleUpload}
                            disabled={!selectedFile}
                        >
                            Subir Plantilla
                        </button>
                    </div>
                    {feedbackMessage && <div className="form-text mt-2">{feedbackMessage}</div>}
                </div>

                <div>
                    <h5>Plantillas Existentes</h5>
                    <ul className="list-group">
                        {/* {templates.map(template => (
                            <li key={template.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span><i className="bi bi-file-earmark-word-fill me-2"></i>{template.name}</span>
                                <button className="btn btn-outline-danger btn-sm">Eliminar</button>
                            </li>
                        ))} */}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GestionDocumentos;
