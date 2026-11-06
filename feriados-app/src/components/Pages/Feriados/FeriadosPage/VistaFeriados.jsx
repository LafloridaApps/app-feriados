import PropTypes from 'prop-types';
import TabsFeriados from '../TabsFeriados';

const VistaFeriados = ({ funcionario, resumen, detalle }) => (
    <div className="container-fluid py-4 feriados-page-container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
            <div className="mb-3 mb-md-0">
                <h2 className="mb-1 text-primary fw-bold">
                    <i className="bi bi-calendar-check me-2"></i>{' '}
                    Feriados Legales
                </h2>
                {funcionario?.nombre && (
                    <p className="text-muted mb-0">
                        Consulta el estado de tus vacaciones y días acumulados
                    </p>
                )}
            </div>
        </div>

        <div className="feriados-section-card">
            <TabsFeriados resumen={resumen} detalle={detalle} />
        </div>
    </div>
);

VistaFeriados.propTypes = {
    funcionario: PropTypes.object.isRequired,
    resumen: PropTypes.object.isRequired,
    detalle: PropTypes.array.isRequired,
};

export default VistaFeriados;
