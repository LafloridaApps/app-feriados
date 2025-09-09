import { useTemplates } from '../../../hooks/useTemplates';
import { useTemplateUpload } from '../../../hooks/useTemplateUpload';

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