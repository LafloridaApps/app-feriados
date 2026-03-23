import React from 'react';
import PropTypes from 'prop-types';

const RrhhActions = ({
    selectedItemsCount,
    handleGenerarDecreto,
}) => {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3 text-muted small">
                <i className="bi bi-info-circle text-primary fs-5"></i>
                <span>
                    Selecciona uno o más registros de la tabla para habilitar la generación de decretos masivos.
                </span>
            </div>
            <button
                className="btn btn-premium px-4"
                onClick={handleGenerarDecreto}
                disabled={selectedItemsCount === 0}
            >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Generar Decreto ({selectedItemsCount})
            </button>
        </div>
    );
};

RrhhActions.propTypes = {
    selectedItemsCount: PropTypes.number.isRequired,
    handleGenerarDecreto: PropTypes.func.isRequired,
};

export default RrhhActions;
