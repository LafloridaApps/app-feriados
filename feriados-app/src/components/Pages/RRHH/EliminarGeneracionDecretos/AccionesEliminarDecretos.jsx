import PropTypes from 'prop-types';

const AccionesEliminarDecretos = ({ selectedDecretos, handleDeleteSelected }) => {
    return (
        <div className="mb-4 d-flex justify-content-between align-items-center bg-light p-3 rounded-12">
            <div className="d-flex align-items-center text-muted small">
                <i className="bi bi-info-circle me-2"></i>{' '}
                Selecciona los decretos que deseas revertir permanentemente.
            </div>
            <button
                className="btn btn-danger px-4"
                onClick={handleDeleteSelected}
                disabled={selectedDecretos.length === 0}
                style={{ borderRadius: '10px' }}
            >
                <i className="bi bi-trash-fill me-2"></i>
                Eliminar Seleccionados ({selectedDecretos.length})
            </button>
        </div>
    );
};

AccionesEliminarDecretos.propTypes = {
    selectedDecretos: PropTypes.array.isRequired,
    handleDeleteSelected: PropTypes.func.isRequired,
};

export default AccionesEliminarDecretos;
