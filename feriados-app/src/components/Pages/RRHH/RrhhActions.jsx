import React from 'react';
import PropTypes from 'prop-types';

const RrhhActions = ({
    selectedItemsCount,
    handleExportToExcel,
    handleGenerarDecreto,
}) => {
    return (
        <div className="d-flex justify-content-end mb-3">
            <button
                className="btn btn-success me-2"
                onClick={handleExportToExcel}
                disabled={selectedItemsCount === 0}
            >
                Exportar a Excel ({selectedItemsCount})
            </button>
            <button
                className="btn btn-primary"
                onClick={handleGenerarDecreto}
                disabled={selectedItemsCount === 0}
            >
                Generar Decreto ({selectedItemsCount})
            </button>
        </div>
    );
};

RrhhActions.propTypes = {
    selectedItemsCount: PropTypes.number.isRequired,
    handleExportToExcel: PropTypes.func.isRequired,
    handleGenerarDecreto: PropTypes.func.isRequired,
};

export default RrhhActions;
