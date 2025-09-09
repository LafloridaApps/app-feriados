import DetalleSolicitud from './DetalleSolicitud';
import PropTypes from 'prop-types';
import { useGestionAcciones } from '../../../hooks/useGestionAcciones';
import { usePostergacion } from '../../../hooks/usePostergacion';

function SolicitudItemMobile({
    solicitud,
    handlerAprobar,
    handlerVisar,
    handlerEntrada,
    onActualizarSolicitud,
    rutFuncionario, // rutFuncionario is needed for postergacion
    open,
    handleVerDetalleClick
}) {
    const { subroganciaInfo, nombreFuncionario } = solicitud;

    // Use the centralized hook
    const acciones = useGestionAcciones(solicitud.derivaciones?.[0]);
    const { handlePostergar } = usePostergacion(solicitud, rutFuncionario, onActualizarSolicitud);

    const isSubrogada = subroganciaInfo && subroganciaInfo.length > 0;
    const subroganciaText = isSubrogada ? `(Subrogando a ${subroganciaInfo[0].nombreDeptoSubrogado})` : '';

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h6 className="card-title font-weight-bold mb-1">
                    {nombreFuncionario}
                    {isSubrogada && <small className="d-block text-info">{subroganciaText}</small>}
                </h6>
                <div className="d-flex justify-content-end mb-2">
                    {acciones.puedeRecibir && (
                        <button
                            className="btn btn-success btn-sm mr-2"
                            onClick={() => handlerEntrada(acciones.idDerivacion)}
                            title="Recibir"
                        >
                            Recibir <i className="bi bi-check-circle-fill"></i>
                        </button>
                    )}
                    {acciones.puedePostergar && (
                        <button
                            className="btn btn-warning btn-sm mr-2"
                            title="Postergar"
                            onClick={handlePostergar}
                        >
                            Postergar <i className="bi bi-clock-history"></i>
                        </button>
                    )}
                    {acciones.puedeVisar && (
                        <button
                            onClick={() => handlerVisar(acciones.idDerivacion)}
                            className="btn btn-outline-primary btn-sm mr-2"
                        >
                            Visar
                        </button>
                    )}
                    {acciones.esDerivada && (
                        <p className='text-success'><strong>DERIVADA</strong></p>
                    )}
                    {acciones.puedeFirmar && (
                        <button
                            onClick={() => handlerAprobar(acciones.idDerivacion)}
                            className="btn btn-primary btn-sm"
                        >
                            Firmar
                        </button>
                    )}
                    {acciones.esFinalizada && (
                        <p className='text-success'><strong>FIRMADA</strong></p>
                    )}
                    {acciones.esPostergada && (
                        <p className='text-danger'><strong>POSTERGADA</strong></p>
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
