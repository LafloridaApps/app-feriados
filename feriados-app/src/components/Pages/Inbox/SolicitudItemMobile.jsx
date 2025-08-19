// SolicitudItemMobile.jsx
import { useContext } from 'react';
import Swal from 'sweetalert2';
import DetalleSolicitud from './DetalleSolicitud';
import PropTypes from 'prop-types';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { savePostergacion } from '../../../services/postergacionService';
import { useAlertaSweetAlert } from '../../../hooks/useAlertaSweetAlert';


function SolicitudItemMobile({
    solicitud,
    handlerAprobar,
    handlerVisar,
    rutFuncionario,
    handlerEntrada,
    onActualizarSolicitud,
    open,
    handleVerDetalleClick

}) {


    const { mostrarAlertaError, mostrarAlertaExito } = useAlertaSweetAlert();

    const { id, subroganciaInfo, nombreFuncionario } = solicitud;
    const isSubrogada = subroganciaInfo && subroganciaInfo.length > 0;
    const subroganciaText = isSubrogada ? `(Subrogando a ${subroganciaInfo[0].nombreDeptoSubrogado})` : '';

    const derivaciones = solicitud?.derivaciones;

    const tieneDerivaciones = derivaciones && derivaciones.length > 0;

    const idDerivacion = tieneDerivaciones ? derivaciones[0].id : null;

    const tipoMovimiento = tieneDerivaciones ? derivaciones[0].tipoMovimiento : null;

    const estadoDerivacion = tieneDerivaciones ? derivaciones[0].estadoDerivacion : null;

    const recepcionada = tieneDerivaciones ? derivaciones[0].recepcionada : null;

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
            if (result.isConfirmed) {
                try {
                    const datosPostergacion = {
                        idSolicitud: id,
                        motivo: result.value,
                        postergadoPor: rutFuncionario
                    };
                    console.log(datosPostergacion);
                    await savePostergacion(datosPostergacion);
                    mostrarAlertaExito('Éxito', 'La solicitud ha sido postergada correctamente.');
                    onActualizarSolicitud();
                } catch (error) {
                    console.error("Error al postergar la solicitud:", error);
                    mostrarAlertaError('No se pudo postergar la solicitud.');
                }
            }
        });
    };

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h6 className="card-title font-weight-bold mb-1">
                    {nombreFuncionario}
                    {isSubrogada && <small className="d-block text-info">{subroganciaText}</small>}
                </h6>
                <div className="d-flex justify-content-end mb-2">
                    {
                        !recepcionada && (
                            <button
                                className="btn btn-success btn-sm mr-2"
                                onClick={() => {
                                    handlerEntrada(idDerivacion);
                                }}
                                title="Recibir"
                            >
                                Recibir  <i className="bi bi-check-circle-fill"></i>
                            </button>
                        )
                    }
                    {
                        recepcionada && estadoDerivacion != "DERIVADA" && estadoDerivacion != "FINALIZADA" &&
                        estadoDerivacion != "POSTERGADA" && (
                            <button
                                className="btn btn-warning btn-sm mr-2"
                                title="Postergar"
                                onClick={handlePostergar}
                            >
                                Postergar <i className="bi bi-clock-history"></i>
                            </button>
                        )
                    }
                    {
                        recepcionada && tipoMovimiento === "VISACION" && estadoDerivacion === "PENDIENTE" && (
                            <button
                                onClick={() => handlerVisar(idDerivacion)}
                                className="btn btn-outline-primary btn-sm mr-2">
                                Visar
                            </button>
                        )
                    }
                    {
                        recepcionada && estadoDerivacion === "DERIVADA" &&
                        (<p className='text-success'><strong>DERIVADA</strong></p>)
                    }
                    {
                        recepcionada && tipoMovimiento === "FIRMA" && estadoDerivacion === "PENDIENTE" && (
                            <button
                                onClick={() => handlerAprobar(idDerivacion)}
                                className="btn btn-primary btn-sm">
                                Firmar
                            </button>
                        )
                    }
                    {
                        recepcionada && estadoDerivacion === "FINALIZADA" &&
                        (<p className='text-success'><strong>FIRMADA</strong></p>)
                    }
                    {
                        recepcionada && estadoDerivacion === "POSTERGADA" &&
                        (<p className='text-danger'><strong>POSTERGADA</strong></p>)
                    }
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
            })
        ),
    }).isRequired,
    handlerAprobar: PropTypes.func.isRequired,
    handlerVisar: PropTypes.func.isRequired,
    handlerEntrada: PropTypes.func.isRequired,
    onActualizarSolicitud: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    handleVerDetalleClick: PropTypes.func.isRequired
};

export default SolicitudItemMobile;
