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
            case 'ANULACIÓN':
                return 'bi bi-slash-circle-fill';
            default:
                return 'bi bi-info-lg';
        }
    };

    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'ANULADA':   return 'badge bg-danger text-white border small fw-normal';
            case 'POSTERGADA': return 'badge bg-warning text-dark border small fw-normal';
            case 'APROBADA':  return 'badge bg-success text-white border small fw-normal';
            default:          return 'badge bg-light text-dark border small fw-normal';
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
                        {solicitud.trazabilidad.map((evento, idx) => {
                            const esUltimoEvento = idx === solicitud.trazabilidad.length - 1;
                            const esAnulada = solicitud.estadoSolicitud === 'ANULADA';
                            // Si la solicitud está anulada, no mostrar el badge PENDIENTE del último evento real
                            const estadoMostrar = (esUltimoEvento && esAnulada && evento.estado === 'PENDIENTE')
                                ? null
                                : evento.estado;

                            return (
                                <div key={`${evento.fecha}-${evento.accion}-${idx}`} className="timeline-item-premium">
                                    <div className="timeline-dot">
                                        <i className={getIconForAction(evento.accion)} />
                                    </div>
                                    <div className="timeline-content-card">
                                        <div className="timeline-title d-flex justify-content-between">
                                            <span>{evento.accion}</span>
                                            {estadoMostrar && (
                                                <span className={getBadgeClass(estadoMostrar)}>
                                                    {estadoMostrar}
                                                </span>
                                            )}
                                        </div>
                                        <div className="timeline-meta mt-1">
                                            <div><i className="bi bi-person me-1" /> {evento.usuario}</div>
                                            <div><i className="bi bi-calendar3 me-1" /> {formatFecha(evento.fecha)}</div>
                                            {evento.departamento && (
                                                <div className="mt-1 small"><i className="bi bi-diagram-3 me-1" /> {evento.departamento}</div>
                                            )}
                                            {evento.estado === "POSTERGADA" && evento.glosa && (
                                                <div className="mt-2 p-2 bg-danger-subtle text-danger rounded small">
                                                    <strong>Motivo:</strong> {evento.glosa}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Nodo sintético de anulación cuando el backend no lo envía */}
                        {solicitud.estadoSolicitud === 'ANULADA' && (
                            <div className="timeline-item-premium">
                                <div className="timeline-dot" style={{ borderColor: '#dc2626', boxShadow: '0 0 0 4px #fee2e2', color: '#dc2626' }}>
                                    <i className="bi bi-slash-circle-fill" />
                                </div>
                                <div className="timeline-content-card" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                    <div className="timeline-title d-flex justify-content-between">
                                        <span className="text-danger fw-bold">Anulación</span>
                                        <span className="badge bg-danger text-white small fw-normal">ANULADA</span>
                                    </div>
                                    {solicitud.motivoAnulacion && (
                                        <div className="timeline-meta mt-1">
                                            <div className="mt-1 p-2 bg-danger-subtle text-danger rounded small">
                                                <strong>Motivo:</strong> {solicitud.motivoAnulacion}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
        estadoSolicitud: PropTypes.string,
        motivoAnulacion: PropTypes.string,
        trazabilidad: PropTypes.arrayOf(PropTypes.shape({
            fecha: PropTypes.string.isRequired,
            accion: PropTypes.string.isRequired,
            usuario: PropTypes.string.isRequired,
            estado: PropTypes.string,
            glosa: PropTypes.string,
            departamento: PropTypes.string,
        })).isRequired,
    }).isRequired,
};

export default DetalleMiSolicitud;