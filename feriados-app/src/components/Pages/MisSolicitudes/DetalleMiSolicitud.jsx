import PropTypes from 'prop-types';
import { formatFecha } from '../../../services/utils';

const DetalleMiSolicitud = ({ solicitud }) => {





    const getIconForAction = (action) => {
        switch (action.toUpperCase()) {
            case 'CREACIÓN':
                return 'bi bi-pencil-fill';
            case 'VISACIÓN':
                return 'bi bi-check-circle-fill';
            case 'APROBACIÓN':
                return 'bi bi-patch-check-fill';
            case 'POSTERGACIÓN':
                return 'bi bi-x-circle-fill';
            default:
                return 'bi bi-info-lg';
        }
    };


    return (
        <div className="p-4 bg-white rounded-3 shadow-sm border mt-2">
            <div className="row g-4">
                <div className="col-12 col-md-5">
                    <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-info-circle-fill text-primary me-2 fs-5"></i>
                        <h6 className="mb-0 fw-bold">Detalles del Permiso</h6>
                    </div>
                    <div className="ps-0 ps-md-2">
                        <div className="mb-3 d-flex justify-content-between border-bottom pb-2">
                            <span className="text-muted small">Desde:</span>
                            <span className="fw-bold">{formatFecha(solicitud.fechaInicio)}</span>
                        </div>
                        <div className="mb-3 d-flex justify-content-between border-bottom pb-2">
                            <span className="text-muted small">Hasta:</span>
                            <span className="fw-bold">{formatFecha(solicitud.fechaFin)}</span>
                        </div>
                        <div className="mb-0 d-flex justify-content-between">
                            <span className="text-muted small">Días solicitados:</span>
                            <span className="badge bg-primary rounded-pill px-3">{solicitud.cantidadDias}</span>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-7 border-top border-md-top-0 border-md-start ps-md-4 pt-4 pt-md-0">
                    <div className="d-flex align-items-center mb-4">
                        <i className="bi bi-clock-history text-primary me-2 fs-5"></i>
                        <h6 className="mb-0 fw-bold">Trazabilidad</h6>
                    </div>
                    <div className="timeline-premium ps-2">
                        {solicitud.trazabilidad.map((evento, idx) => (
                            <div key={`${evento.fecha}-${evento.accion}-${idx}`} className="timeline-item-premium">
                                <div className="timeline-dot">
                                    <i className={getIconForAction(evento.accion)}></i>
                                </div>
                                <div className="timeline-content-card">
                                    <div className="timeline-title d-flex justify-content-between">
                                        <span>{evento.accion}</span>
                                        {evento.estado && (
                                            <span className="badge bg-light text-dark border small fw-normal">
                                                {evento.estado}
                                            </span>
                                        )}
                                    </div>
                                    <div className="timeline-meta mt-1">
                                        <div><i className="bi bi-person me-1"></i> {evento.usuario}</div>
                                        <div><i className="bi bi-calendar3 me-1"></i> {formatFecha(evento.fecha)}</div>
                                        {evento.departamento && (
                                            <div className="mt-1 small"><i className="bi bi-diagram-3 me-1"></i> {evento.departamento}</div>
                                        )}
                                        {evento.estado === "POSTERGADA" && evento.glosa && (
                                            <div className="mt-2 p-2 bg-danger-subtle text-danger rounded small">
                                                <strong>Motivo:</strong> {evento.glosa}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

DetalleMiSolicitud.propTypes = {
    solicitud: PropTypes.shape({
        fechaInicio: PropTypes.string.isRequired,
        fechaFin: PropTypes.string.isRequired,
        cantidadDias: PropTypes.number.isRequired,
        trazabilidad: PropTypes.arrayOf(PropTypes.shape({
            fecha: PropTypes.string.isRequired,
            accion: PropTypes.string.isRequired,
            usuario: PropTypes.string.isRequired,
            departamento: PropTypes.string, // Cambiado de comentario a departamento
        })).isRequired,
    }).isRequired,
};

export default DetalleMiSolicitud;