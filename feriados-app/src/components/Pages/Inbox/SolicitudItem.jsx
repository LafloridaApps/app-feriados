import Swal from 'sweetalert2';
import DetalleSolicitud from './DetalleSolicitud';
import SolicitudItemMobile from './SolicitudItemMobile';
import PropTypes from 'prop-types';
import { formatFecha } from '../../../services/utils';
import { savePostergacion } from '../../../services/postergacionService';
import { useAlertaSweetAlert } from '../../../hooks/useAlertaSweetAlert';
import { useGestionAcciones } from '../../../hooks/useGestionAcciones';

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
    const { mostrarAlertaError, mostrarAlertaExito } = useAlertaSweetAlert();
    const { id, nombreFuncionario, fechaSolicitud, tipoSolicitud, estadoSolicitud, subroganciaInfo } = solicitud;

    const acciones = useGestionAcciones(solicitud.derivaciones?.[0]);

    const isSubrogada = subroganciaInfo && subroganciaInfo.length > 0;
    const subroganciaText = isSubrogada ? `(Subrogando a ${subroganciaInfo[0].nombreDeptoSubrogado})` : '';

    const handlePostergar = () => {
        Swal.fire({
            title: '¿Está seguro de postergar?',
            text: "Por favor, ingrese el motivo de la postergación:",
            input: 'textarea',
            inputPlaceholder: 'Escriba el motivo aquí...',
            showCancelButton: true,
            confirmButtonText: 'Sí, postergar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return '¡Necesita escribir un motivo!';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    const datosPostergacion = {
                        idSolicitud: id,
                        motivo: result.value,
                        postergadoPor: rutFuncionario
                    };
                    await savePostergacion(datosPostergacion);
                    mostrarAlertaExito('Éxito', 'La solicitud ha sido postergada correctamente.');
                    onActualizarSolicitud();
                } catch (error) {
                    console.error('Error al postergar la solicitud:', error);
                    mostrarAlertaError('No se pudo postergar la solicitud.');
                }
            }
        });
    };

    return (
        <>
            <tr className={`d-none d-md-table-row align-middle ${acciones.puedeRecibir ? 'fw-bold' : ''}`}>
                <td>{id}</td>
                <td className="text-truncate" style={{ maxWidth: '250px' }}>
                    {nombreFuncionario}
                    {isSubrogada && <small className="d-block text-info">{subroganciaText}</small>}
                </td>
                <td>{tipoSolicitud}</td>
                <td>{formatFecha(fechaSolicitud)}</td>
                <td>{estadoSolicitud}</td>
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
                        {acciones.puedeFirmar && (
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
    onActualizarSolicitud: PropTypes.func.isRequired,
    rutFuncionario: PropTypes.string.isRequired,
    handlerEntrada: PropTypes.func.isRequired,
    handlerVisar: PropTypes.func.isRequired,
    handlerAprobar: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    handleVerDetalleClick: PropTypes.func.isRequired,
};