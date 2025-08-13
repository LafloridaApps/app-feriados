// SolicitudItemMobile.jsx
import DetalleSolicitud from './DetalleSolicitud';
import PropTypes from 'prop-types';

function SolicitudItemMobile({
    solicitud,
    handlerAprobar,
    handlerVisar,
    handlerEntrada,
    open,
    handleVerDetalleClick

}) {

    const { subroganciaInfo, nombreFuncionario } = solicitud;
    const isSubrogada = subroganciaInfo && subroganciaInfo.length > 0;
    const subroganciaText = isSubrogada ? `(Subrogando a ${subroganciaInfo[0].nombreDeptoSubrogado})` : '';

    const derivaciones = solicitud?.derivaciones;

    const tieneDerivaciones = derivaciones && derivaciones.length > 0;

    const idDerivacion = tieneDerivaciones ? derivaciones[0].id : null;

    const tipoMovimiento = tieneDerivaciones ? derivaciones[0].tipoMovimiento : null;

    const estadoDerivacion = tieneDerivaciones ? derivaciones[0].estadoDerivacion : null;


    const recepcionada = tieneDerivaciones ? derivaciones[0].recepcionada : null;



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
                        recepcionada && tipoMovimiento === "VISACION" && estadoDerivacion === "PENDIENTE" && (
                            <button
                                onClick={() => handlerVisar(idDerivacion)}
                                className="btn btn-outline-primary btn-sm mr-2">
                                Visar
                            </button>
                        )
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
    open: PropTypes.bool.isRequired,
    handleVerDetalleClick: PropTypes.func.isRequired
};

export default SolicitudItemMobile;