import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { deleteTemplate, listTemplates, uploadFileTemplate, viewTemplate } from '../../../services/templateService';

const GestionDocumentos = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [nombrePlantilla, setNombrePlantilla] = useState('');
    const [templates, setTemplates] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const fetchTemplates = async () => {
        try {
            const templatesData = await listTemplates();
            setTemplates(templatesData);
        } catch (error) {
            console.error("Error al obtener plantillas:", error);
            Swal.fire({
                icon: "error",
                title: "Error al cargar plantillas",
                text: "No se pudieron obtener las plantillas existentes.",
            });
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

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
            fetchTemplates();
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

    const handleDelete = async (id) =>{

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteTemplate(id);
                    Swal.fire(
                        'Eliminado!',
                        response.message,
                        'success'
                    );
                    fetchTemplates();
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'No se pudo eliminar la plantilla.',
                        'error'
                    );
                }
            }
        });
    }



    const handleView = async (docFile, nombrePlantilla) => {
        if (!docFile) {
            Swal.fire('Error', 'No hay un archivo asociado para ver.', 'error');
            return;
        }

        Swal.fire({
            title: 'Descargando documento',
            text: 'Por favor, espera un momento...',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const blob = await viewTemplate(docFile);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            // Usa el nombre de la plantilla para el archivo, asegurando que termine en .docx
            const fileName = nombrePlantilla.toLowerCase().endsWith('.docx') ? nombrePlantilla : `${nombrePlantilla}.docx`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            Swal.close();
        } catch (error) {
            Swal.close();
            Swal.fire(
                'Error de descarga',
                'No se pudo descargar el documento. Por favor, inténtalo de nuevo.',
                'error'
            );
            console.error("Error en handleView:", error);
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
                            value={nombrePlantilla}
                            onChange={(e) => setNombrePlantilla(e.target.value)}
                        />
                        <input
                            key={fileInputKey}
                            type="file"
                            className="form-control"
                            accept=".docx"
                            onChange={handleFileChange}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleUpload}
                            disabled={!selectedFile || !nombrePlantilla}
                        >
                            <i className="bi bi-upload me-2"></i>Subir Plantilla
                        </button>
                    </div>
                    {feedbackMessage && <div className="form-text text-danger mt-2">{feedbackMessage}</div>}
                </div>

                <div>
                    <h5>Plantillas Existentes</h5>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Nombre Plantilla</th>
                                    <th>Nombre Documento</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.length > 0 ? (
                                    templates.map(template => (
                                        <tr key={template.id}>
                                            <td>{template.nombre}</td>
                                            <td>{template.docFile || 'No especificado'}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() => handleView(template.docFile, template.nombre)}
                                                    title="Ver Documento"
                                                >
                                                    <i className="bi bi-eye-fill"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleDelete(template.id)}
                                                    title="Eliminar"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">No hay plantillas existentes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionDocumentos;
