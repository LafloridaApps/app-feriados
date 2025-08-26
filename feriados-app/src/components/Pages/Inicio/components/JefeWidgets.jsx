
import PropTypes from 'prop-types';

const JefeWidgets = ({ esJefe, solicitudesPendientes, ausenciasEquipo }) => {
    if (!esJefe) {
        return null;
    }

    return (
        <>
            {/* Solicitudes Pendientes (for managers) */}
            <div className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm rounded-3 p-3 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: '#e0f7fa' }}>
                    <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-bell-fill text-info me-2 fs-4"></i>
                        <h5 className="card-title mb-0">Solicitudes Pendientes</h5>
                    </div>
                    <p className="card-text fs-2 fw-bold text-info text-center">{solicitudesPendientes}</p>
                    <a href="/inbox" className="btn btn-sm btn-outline-info mt-auto">Ver Solicitudes</a>
                </div>
            </div>

            {/* Ausencias del Equipo (for managers) */}
            <div className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm rounded-3 p-3 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: '#ffe0b2' }}>
                    <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-people-fill text-danger me-2 fs-4"></i>
                        <h5 className="card-title mb-0">Ausencias del Equipo Hoy</h5>
                    </div>
                    <p className="card-text fs-2 fw-bold text-danger text-center">{ausenciasEquipo}</p>
                    <a href="/dashboard" className="btn btn-sm btn-outline-danger mt-auto">Ver Dashboard</a>
                </div>
            </div>
        </>
    );
};

JefeWidgets.propTypes = {
    esJefe: PropTypes.bool,
    solicitudesPendientes: PropTypes.number,
    ausenciasEquipo: PropTypes.number,
};

JefeWidgets.defaultProps = {
    esJefe: false,
    solicitudesPendientes: 0,
    ausenciasEquipo: 0,
};

export default JefeWidgets;
