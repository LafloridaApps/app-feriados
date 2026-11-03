import PropTypes from 'prop-types';
import RrhhActions from '../RrhhActions';

const AccionesGeneradorDecretos = ({
    currentAprobaciones,
    selectedItemsCount,
    handleGenerarDecreto
}) => {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id="headingAcciones">
                <button
                    className={`accordion-button ${currentAprobaciones.length === 0 ? 'collapsed' : ''}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseAcciones"
                    aria-expanded={currentAprobaciones.length > 0}
                    aria-controls="collapseAcciones"
                    disabled={currentAprobaciones.length === 0}
                >
                    <span className="step-indicator"></span>  <strong>Acciones Masivas</strong>
                </button>
            </h2>
            <div
                id="collapseAcciones"
                className={`accordion-collapse collapse ${currentAprobaciones.length > 0 ? 'show' : ''}`}
                aria-labelledby="headingAcciones"
                data-bs-parent="#accordionGeneradorDecretos"
            >
                <div className="accordion-body px-4 pb-4">
                    <RrhhActions
                        selectedItemsCount={selectedItemsCount}
                        handleGenerarDecreto={handleGenerarDecreto}
                    />
                </div>
            </div>
        </div>
    );
};

AccionesGeneradorDecretos.propTypes = {
    currentAprobaciones: PropTypes.array.isRequired,
    selectedItemsCount: PropTypes.number.isRequired,
    handleGenerarDecreto: PropTypes.func.isRequired,
};

export default AccionesGeneradorDecretos;
