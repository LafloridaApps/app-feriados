import PropTypes from 'prop-types';

const FilaPlantilla = ({ template, handleView, handleDelete }) => (
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
);

FilaPlantilla.propTypes = {
    template: PropTypes.object.isRequired,
    handleView: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default FilaPlantilla;
