
import PropTypes from 'prop-types';

const SolicitudesMesWidget = ({ solicitudes = [] }) => {
    return (
        <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm rounded-3 p-3 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: '#eef7ff' }}>
                <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-file-earmark-text-fill text-primary me-2 fs-4"></i>
                    <h5 className="card-title mb-0">Solicitudes del Mes</h5>
                </div>
                {solicitudes.length > 0 ? (
                    <ul className="list-group list-group-flush flex-grow-1">
                        {solicitudes.map(({ tipoSolicitud, estado, fechaSolicitud, idSolicitud }) => (
                            <li key={idSolicitud} className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 bg-transparent border-0">
                                <span>{tipoSolicitud} ({fechaSolicitud})</span>
                                <span className={`badge bg-${estado === 'APROBADA' ? 'success' : 'warning'}`}>{estado}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted text-center flex-grow-1 d-flex align-items-center justify-content-center">No hay solicitudes este mes.</p>
                )}
                <a href="/mis-solicitudes" className="btn btn-sm btn-outline-primary mt-auto">Ver Todas</a>
            </div>
        </div>
    );
};

SolicitudesMesWidget.propTypes = {
    solicitudes: PropTypes.arrayOf(PropTypes.shape({
        idSolicitud: PropTypes.any.isRequired,
        tipoSolicitud: PropTypes.string,
        fechaSolicitud: PropTypes.string,
        estado: PropTypes.string,
    })),
};

SolicitudesMesWidget.defaultProps = {
    solicitudes: [],
};

export default SolicitudesMesWidget;
