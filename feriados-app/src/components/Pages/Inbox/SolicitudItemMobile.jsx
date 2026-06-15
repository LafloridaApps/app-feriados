import DetalleSolicitud from './DetalleSolicitud';
import PropTypes from 'prop-types';
import { useSolicitudItem, getStatusBadge } from '../../../hooks/useSolicitudItem';

function SolicitudItemMobile({
    solicitud,
    handlerAprobar,
    handlerVisar,
    handlerEntrada,
    onActualizarSolicitud,
    rutFuncionario,
    open,
    handleVerDetalleClick
}) {
    const { nombreFuncionario, tieneAnulacionPendiente } = solicitud;

    const {
        handleVerAnulacion,
        acciones,
        handlePostergar,
        isSubrogada,
        subroganciaText,
        esNoLeida
    } = useSolicitudItem(solicitud, rutFuncionario, onActualizarSolicitud);

    return (
        <div
            className={`card shadow-sm mb-3 border-0 ${esNoLeida ? 'bg-light' : ''}`}
            style={tieneAnulacionPendiente ? {
                borderLeft: '5px solid #f97316',
                background: 'linear-gradient(90deg, #fff7ed 0%, #ffffff 35%)',
            } : { borderLeft: '5px solid #0d6efd', borderRadius: '0.5rem' }}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="card-title fw-bold mb-0 d-flex align-items-center gap-2">
                        <div>
                            <span className={`d-block text-dark ${esNoLeida ? 'fw-bolder' : ''}`}>{nombreFuncionario}</span>
                            {isSubrogada && <small className="d-block text-info fw-normal" style={{ fontSize: '0.75rem' }}>{subroganciaText}</small>}
                        </div>
                        {tieneAnulacionPendiente && (
                            <span
                                style={{
                                    width: 9,
                                    height: 9,
                                    borderRadius: '50%',
                                    background: '#f97316',
                                    display: 'inline-block',
                                    animation: 'pulse-orange 1.4s infinite',
                                    flexShrink: 0,
                                }}
                                title="Tiene anulación pendiente"
                            />
                        )}
                    </h6>
                    <span className={getStatusBadge(solicitud.estadoSolicitud, true)} style={{ fontSize: '0.65rem', padding: '4px 8px' }}>
                        {solicitud.estadoSolicitud}
                    </span>
                </div>
                <div className="d-flex justify-content-end mb-2">
                    {acciones.puedeRecibir && solicitud.estadoSolicitud !== 'ANULADA' && (
                        <button
                            className="btn btn-outline-success btn-sm me-2 rounded-pill px-3"
                            onClick={() => handlerEntrada(acciones.idDerivacion)}
                            title="Recibir"
                        >
                            Recibir <i className="bi bi-box-arrow-in-down ms-1"></i>
                        </button>
                    )}
                    {acciones.puedePostergar && solicitud.estadoSolicitud !== 'ANULADA' && (
                        <button
                            className="btn btn-outline-warning btn-sm me-2 rounded-pill px-3"
                            title="Postergar"
                            onClick={handlePostergar}
                        >
                            Postergar <i className="bi bi-clock-history ms-1"></i>
                        </button>
                    )}
                    {acciones.puedeVisar && solicitud.estadoSolicitud !== 'ANULADA' && (
                        <button
                            onClick={() => handlerVisar(acciones.idDerivacion)}
                            className="btn btn-outline-primary btn-sm me-2 rounded-pill px-3"
                        >
                            Visar <i className="bi bi-check-all ms-1"></i>
                        </button>
                    )}
                    {acciones.esDerivada && (
                        <span className='badge bg-success bg-opacity-10 text-success border border-success-subtle rounded-pill px-3 py-2 me-2'>
                            <i className="bi bi-arrow-right-circle me-1"></i> DERIVADA
                        </span>
                    )}
                    {acciones.puedeFirmar && solicitud.estadoSolicitud !== 'ANULADA' && (
                        <button
                            onClick={() => handlerAprobar(acciones.idDerivacion)}
                            className="btn btn-success btn-sm rounded-pill px-3 shadow-sm"
                        >
                            Firmar <i className="bi bi-patch-check-fill ms-1"></i>
                        </button>
                    )}
                    {acciones.esFinalizada && (
                        <span className='badge bg-success text-white rounded-pill px-3 py-2 shadow-sm'>
                            <i className="bi bi-check-circle-fill me-1"></i> FIRMADA
                        </span>
                    )}
                    {acciones.esPostergada && (
                        <span className='badge bg-danger bg-opacity-10 text-danger border border-danger-subtle rounded-pill px-3 py-2'>
                            <i className="bi bi-clock-fill me-1"></i> POSTERGADA
                        </span>
                    )}
                    {tieneAnulacionPendiente && (
                        <button
                            className="btn btn-sm"
                            onClick={handleVerAnulacion}
                            title="Anulación pendiente — clic para ver detalle"
                            style={{
                                width: 34,
                                height: 34,
                                padding: 0,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fff7ed',
                                color: '#ea580c',
                                border: '1.5px solid #f97316',
                                borderRadius: '50%',
                                fontSize: '0.95rem',
                                boxShadow: '0 0 0 3px rgba(249,115,22,0.15)',
                                animation: 'pulse-orange 1.4s infinite',
                                transition: 'all 0.2s',
                            }}
                        >
                            <i className="bi bi-bell-fill" />
                        </button>
                    )}
                </div>
                <button
                    onClick={handleVerDetalleClick}
                    className="btn btn-sm btn-info btn-block"
                    aria-expanded={open}
                    aria-controls={`collapse-mobile-${solicitud.id}`}
                >
                    Ver Detalle
                </button>
                {open && (
                    <div className="mt-3">
                        <div className="card card-body bg-light">
                            <DetalleSolicitud detalle={solicitud} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

SolicitudItemMobile.propTypes = {
    solicitud: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombreFuncionario: PropTypes.string.isRequired,
        estadoSolicitud: PropTypes.string.isRequired,
        tieneAnulacionPendiente: PropTypes.bool,
        rut: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rutFuncionario: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rutSolicitante: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rutEmpleado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        subroganciaInfo: PropTypes.arrayOf(
            PropTypes.shape({
                nombreDeptoSubrogado: PropTypes.string,
            })
        ),
        derivaciones: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                tipoMovimiento: PropTypes.string.isRequired,
                estadoDerivacion: PropTypes.string.isRequired,
                recepcionada: PropTypes.bool.isRequired,
            })
        ),
    }).isRequired,
    handlerAprobar: PropTypes.func.isRequired,
    handlerVisar: PropTypes.func.isRequired,
    handlerEntrada: PropTypes.func.isRequired,
    onActualizarSolicitud: PropTypes.func.isRequired,
    rutFuncionario: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    handleVerDetalleClick: PropTypes.func.isRequired
};

export default SolicitudItemMobile;
