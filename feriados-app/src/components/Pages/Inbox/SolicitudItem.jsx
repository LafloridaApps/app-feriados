import DetalleSolicitud from './DetalleSolicitud';
import SolicitudItemMobile from './SolicitudItemMobile';
import PropTypes from 'prop-types';
import { formatFecha } from '../../../services/utils';
import { useSolicitudItem, getStatusBadge } from '../../../hooks/useSolicitudItem';

const SolicitudItem = ({
    solicitud,
    onActualizarSolicitud,
    rutFuncionario,
    handlerEntrada,
    handlerVisar,
    handlerAprobar,
    open,
    handleVerDetalleClick
}) => {
    const { id, nombreFuncionario, fechaSolicitud, tipoSolicitud, estadoSolicitud, urlPdf, tieneAnulacionPendiente } = solicitud;

    const {
        handleVerAnulacion,
        acciones,
        handlePostergar,
        isSubrogada,
        subroganciaText,
        esNoLeida
    } = useSolicitudItem(solicitud, rutFuncionario, onActualizarSolicitud);

    return (
        <>
            <tr
                className={`d-none d-md-table-row align-middle ${esNoLeida ? 'fw-bold bg-light' : ''}`}
                style={tieneAnulacionPendiente ? {
                    borderLeft: '5px solid #f97316',
                    background: 'linear-gradient(90deg, #fff7ed 0%, #ffffff 40%)',
                } : { borderLeft: '5px solid transparent' }}
            >
                <td className={`ps-4 ${esNoLeida ? 'fw-bolder text-dark' : 'fw-bold text-secondary'}`}>
                    <div className="d-flex align-items-center gap-2">
                        #{id}
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
                    </div>
                </td>
                <td className="text-truncate" style={{ maxWidth: '250px' }}>
                    <span className={`d-block text-dark ${esNoLeida ? 'fw-bolder' : 'fw-medium'}`}>{nombreFuncionario}</span>
                    {isSubrogada && <small className="d-block text-info fw-bold" style={{ fontSize: '0.75rem' }}>{subroganciaText}</small>}
                </td>
                <td>
                    <span className={`badge ${tipoSolicitud?.includes('FERIADO') ? 'bg-info bg-opacity-10 text-info border border-info-subtle' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle'} px-2 py-1 ${esNoLeida ? 'fw-bold' : ''}`}>
                        {tipoSolicitud}
                    </span>
                </td>
                <td>
                    <span className={`${esNoLeida ? 'text-dark fw-bold' : 'text-muted fw-medium'}`}><i className={`bi bi-calendar-event me-1 ${esNoLeida ? 'text-primary' : 'text-secondary opacity-50'}`}></i> {formatFecha(fechaSolicitud)}</span>
                </td>
                <td>
                    <span className={getStatusBadge(estadoSolicitud)}>{estadoSolicitud}</span>
                </td>
                <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                        {acciones.puedeRecibir && estadoSolicitud !== 'ANULADA' && (
                            <button
                                className="btn btn-outline-success btn-sm rounded-pill px-3"
                                onClick={() => handlerEntrada(acciones.idDerivacion)}
                                title="Recibir"
                            >
                                Recibir <i className="bi bi-box-arrow-in-down ms-1"></i>
                            </button>
                        )}
                    {acciones.puedePostergar && estadoSolicitud !== 'ANULADA' && (
                            <button
                                className="btn btn-outline-warning btn-sm rounded-pill px-3"
                                title="Postergar"
                                onClick={handlePostergar}
                            >
                                Postergar <i className="bi bi-clock-history ms-1"></i>
                            </button>
                        )}
                        {acciones.puedeVisar && estadoSolicitud !== 'ANULADA' && (
                            <button
                                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                onClick={() => handlerVisar(acciones.idDerivacion)}
                                title="Visar"
                            >
                                Visar <i className="bi bi-check-all ms-1"></i>
                            </button>
                        )}
                        {acciones.esDerivada && (
                            <span className='badge bg-success bg-opacity-10 text-success border border-success-subtle rounded-pill px-3 py-2'>
                                <i className="bi bi-arrow-right-circle me-1"></i> DERIVADA
                            </span>
                        )}
                    {acciones.puedeFirmar && estadoSolicitud !== 'ANULADA' && (
                            <button
                                onClick={() => handlerAprobar(acciones.idDerivacion)}
                                className="btn btn-success btn-sm rounded-pill px-3 shadow-sm"
                                title="Firmar"
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
                </td>
                <td className="text-center">
                    <button
                        onClick={handleVerDetalleClick}
                        className="btn btn-sm btn-light text-primary rounded-circle border shadow-sm"
                        aria-expanded={open}
                        aria-controls={`collapse-${id}`}
                        title="Detalle"
                        style={{ width: '32px', height: '32px', padding: 0 }}
                    >
                        <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    </button>

                </td>
                <td className='text-center pe-4'>
                    {
                        urlPdf && (<button
                            className='btn btn-sm btn-outline-danger rounded-circle shadow-sm'
                            onClick={() => window.open(urlPdf, '_blank', 'noopener,noreferrer')}
                            title="Ver Decreto PDF"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                        >
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                        </button>)
                    }


                </td>
            </tr>
            {open && (
                <tr className="d-none d-md-table-row">
                    <td colSpan="7" className="p-0">
                        <div className="collapse show">
                            <div className="card card-body bg-light">
                                <DetalleSolicitud detalle={solicitud} />
                            </div>
                        </div>
                    </td>
                </tr>
            )}
            <tr className="d-md-none">
                <td colSpan="7" className="p-0">
                    <SolicitudItemMobile
                        solicitud={solicitud}
                        handlerAprobar={handlerAprobar}
                        handlerVisar={handlerVisar}
                        handlerEntrada={handlerEntrada}
                        onActualizarSolicitud={onActualizarSolicitud}
                        rutFuncionario={rutFuncionario}
                        open={open}
                        handleVerDetalleClick={handleVerDetalleClick}
                    />
                </td>
            </tr>
        </>
    );
}

export default SolicitudItem;

SolicitudItem.propTypes = {
    solicitud: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombreFuncionario: PropTypes.string.isRequired,
        fechaSolicitud: PropTypes.string.isRequired,
        tipoSolicitud: PropTypes.string.isRequired,
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
        urlPdf: PropTypes.string,
        derivaciones: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                tipoMovimiento: PropTypes.string.isRequired,
                estadoDerivacion: PropTypes.string.isRequired,
                recepcionada: PropTypes.bool.isRequired,
            })
        ),
    }).isRequired,
    onActualizarSolicitud: PropTypes.func.isRequired,
    rutFuncionario: PropTypes.string.isRequired,
    handlerEntrada: PropTypes.func.isRequired,
    handlerVisar: PropTypes.func.isRequired,
    handlerAprobar: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    handleVerDetalleClick: PropTypes.func.isRequired,
};