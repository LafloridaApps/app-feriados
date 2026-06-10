import DetalleSolicitud from './DetalleSolicitud';
import SolicitudItemMobile from './SolicitudItemMobile';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { formatFecha } from '../../../services/utils';
import { useGestionAcciones } from '../../../hooks/useGestionAcciones';
import { usePostergacion } from '../../../hooks/usePostergacion';
import { resolverAnulacion } from '../../../services/anulacionService';

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
    const { id, nombreFuncionario, fechaSolicitud, tipoSolicitud, estadoSolicitud, subroganciaInfo, urlPdf, tieneAnulacionPendiente } = solicitud;

    const handleVerAnulacion = async () => {
        const { isConfirmed, isDenied } = await Swal.fire({
            icon: 'warning',
            title: '⚠️ Anulación Pendiente',
            html: `
                <p>El solicitante <strong>${nombreFuncionario}</strong> ha solicitado la <strong>anulación</strong> de esta solicitud.</p>
                <p class="text-muted small mb-0">¿Desea aprobar o rechazar la solicitud de anulación?</p>
            `,
            showConfirmButton: true,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-check-circle-fill"></i> Aprobar',
            denyButtonText: '<i class="bi bi-x-circle-fill"></i> Rechazar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#16a34a',
            denyButtonColor: '#dc2626',
            reverseButtons: true,
        });

        if (!isConfirmed && !isDenied) return;

        const aprueba = isConfirmed;
        try {
            const respuesta = await resolverAnulacion(id, rutFuncionario, aprueba);
            const mensaje =
                respuesta?.message ||
                respuesta?.mensaje ||
                (aprueba ? 'Anulación aprobada correctamente.' : 'Anulación rechazada correctamente.');
            await Swal.fire({
                icon: 'success',
                title: aprueba ? '✅ Anulación aprobada' : '❌ Anulación rechazada',
                text: mensaje,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#16a34a',
            });
            onActualizarSolicitud?.();
        } catch (error) {
            const mensajeError =
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                error.message ||
                'No se pudo procesar la solicitud de anulación.';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensajeError,
            });
        }
    };


    const acciones = useGestionAcciones(solicitud.derivaciones?.[0]);
    const { handlePostergar } = usePostergacion(solicitud, rutFuncionario, onActualizarSolicitud);

    const isSubrogada = subroganciaInfo && subroganciaInfo.length > 0;
    const subroganciaText = isSubrogada ? `(Subrogando a ${subroganciaInfo[0].nombreDeptoSubrogado})` : '';

    return (
        <>
            <tr
                className={`d-none d-md-table-row align-middle ${acciones.puedeRecibir ? 'fw-bold' : ''}`}
                style={tieneAnulacionPendiente ? {
                    borderLeft: '4px solid #f97316',
                    background: 'linear-gradient(90deg, #fff7ed 0%, #ffffff 40%)',
                } : { borderLeft: '4px solid transparent' }}
            >
                <td>
                    <div className="d-flex align-items-center gap-2">
                        {id}
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
                    {nombreFuncionario}
                    {isSubrogada && <small className="d-block text-info">{subroganciaText}</small>}
                </td>
                <td>{tipoSolicitud}</td>
                <td>{formatFecha(fechaSolicitud)}</td>
                <td>
                    <span>{estadoSolicitud}</span>
                </td>
                <td className="text-right">
                    <div className="d-flex justify-content-start">
                        {acciones.puedeRecibir && (
                            <button
                                className="btn btn-success btn-sm mr-2"
                                onClick={() => handlerEntrada(acciones.idDerivacion)}
                                title="Recibir"
                            >
                                Recibir <i className="bi bi-box-arrow-in-down"></i>
                            </button>
                        )}
                    {acciones.puedePostergar && estadoSolicitud !== 'ANULADA' && (
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
                                className="btn btn-primary btn-sm mr-2"
                                onClick={() => handlerVisar(acciones.idDerivacion)}
                                title="Visar"
                            >
                                Visar <i className="bi bi-check-all"></i>
                            </button>
                        )}
                        {acciones.esDerivada && (
                            <p className='text-success'><strong>DERIVADA</strong></p>
                        )}
                    {acciones.puedeFirmar && estadoSolicitud !== 'ANULADA' && (
                            <button
                                onClick={() => handlerAprobar(acciones.idDerivacion)}
                                className="btn btn-success btn-sm"
                                title="Firmar"
                            >
                                Firmar <i className="bi bi-patch-check-fill"></i>
                            </button>
                        )}
                        {acciones.esFinalizada && (
                            <p className='text-success'><strong>FIRMADA</strong></p>
                        )}
                        {acciones.esPostergada && (
                            <p className='text-danger'><strong>POSTERGADA</strong></p>
                        )}
                        {tieneAnulacionPendiente && (
                            <button
                                className="btn btn-sm ms-1"
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
                <td className="text-right">
                    <button
                        onClick={handleVerDetalleClick}
                        className="btn btn-sm btn-info"
                        aria-expanded={open}
                        aria-controls={`collapse-${id}`}
                        title="Detalle"
                    >
                        <i className="bi bi-list-ul"></i>
                    </button>

                </td>
                <td className='text-right'>
                    {
                        urlPdf && (<button
                            className='btn btn-outline-dark'
                            onClick={() => window.open(urlPdf, '_blank', 'noopener,noreferrer')}
                            title="Ver Decreto PDF"
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