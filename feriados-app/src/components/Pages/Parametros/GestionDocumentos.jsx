import { useTemplates } from '../../../hooks/useTemplates';
import { useTemplateUpload } from '../../../hooks/useTemplateUpload';
import './GestionDocumentos.css'; // Importar el archivo CSS personalizado

const GestionDocumentos = () => {
    const { templates, handleDelete, handleView, fetchTemplates } = useTemplates();
    const {
        selectedFile,
        feedbackMessage,
        nombrePlantilla,
        fileInputKey,
        setNombrePlantilla,
        handleFileChange,
        handleUpload,
    } = useTemplateUpload(fetchTemplates); // Se pasa fetchTemplates como callback

        return (
            <div className="gestion-documentos-container">
                <div className="gestion-documentos-card">
                    <div className="gestion-documentos-card-header">
                        <h3>Gestión de Plantillas de Decretos</h3>
                    </div>
                    <div className="p-4">
                        <div className="gestion-documentos-upload-section">
                            <h5>Subir Nueva Plantilla</h5>
                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            id="templateName"
                                            className="form-control border-0 bg-white"
                                            placeholder="Nombre de la Plantilla"
                                            value={nombrePlantilla}
                                            onChange={(e) => setNombrePlantilla(e.target.value)}
                                        />
                                        <label htmlFor="templateName">Nombre de la Plantilla</label>
                                    </div>
                                </div>
                                <div className="col-12 col-md-5">
                                    <div className="form-floating">
                                        <input
                                            key={fileInputKey}
                                            id="templateFile"
                                            type="file"
                                            className="form-control border-0 bg-white"
                                            accept=".docx"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="templateFile">Seleccionar Archivo (.docx)</label>
                                    </div>
                                </div>
                                <div className="col-12 col-md-3 d-flex align-items-stretch">
                                    <button
                                        className="btn upload-button-premium text-white w-100 shadow-sm"
                                        onClick={handleUpload}
                                        disabled={!selectedFile || !nombrePlantilla}
                                    >
                                        <i className="bi bi-cloud-arrow-up-fill me-2"></i>{' '}
                                        Subir Plantilla
                                    </button>
                                </div>
                            </div>
                            {feedbackMessage && (
                                <div className="mt-3 d-flex align-items-center text-danger small fw-bold">
                                    <i className="bi bi-exclamation-circle-fill me-2"></i>{' '}
                                    {feedbackMessage}
                                </div>
                            )}
                        </div>
    
                        <div className="mt-4">
                            <h5 className="text-dark fw-bold mb-4 d-flex align-items-center">
                                <i className="bi bi-files me-2 text-primary"></i>{' '}
                                Plantillas Existentes
                            </h5>
                            <div className="table-responsive">
                                <table className="table gestion-documentos-table">
                                    <thead>
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
                                                    <td className="fw-bold">{template.nombre}</td>
                                                    <td className="text-muted">{template.docFile || 'No especificado'}</td>
                                                    <td className="text-center">
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <button
                                                                className="btn btn-action-premium btn-action-view"
                                                                onClick={() => handleView(template.docFile, template.nombre)}
                                                                title="Ver Documento"
                                                            >
                                                                <i className="bi bi-eye-fill"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-action-premium btn-action-delete"
                                                                onClick={() => handleDelete(template.id)}
                                                                title="Eliminar"
                                                            >
                                                                <i className="bi bi-trash-fill"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-5 text-muted">
                                                    <i className="bi bi-folder-x fs-1 d-block mb-2 opacity-50"></i>{' '}
                                                    No hay plantillas existentes.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    export default GestionDocumentos;