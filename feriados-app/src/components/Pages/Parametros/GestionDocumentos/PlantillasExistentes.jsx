import PropTypes from 'prop-types';
import FilaPlantilla from './FilaPlantilla';

const PlantillasExistentes = ({ templates, handleView, handleDelete }) => (
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
                            <FilaPlantilla key={template.id} template={template}
                                handleView={handleView} handleDelete={handleDelete} />
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
);

PlantillasExistentes.propTypes = {
    templates: PropTypes.array.isRequired,
    handleView: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default PlantillasExistentes;
