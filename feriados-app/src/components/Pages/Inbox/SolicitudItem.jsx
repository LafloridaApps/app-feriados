import DetalleSolicitud from './DetalleSolicitud';
import SolicitudItemMobile from './SolicitudItemMobile';
import PropTypes from 'prop-types';
import { formatFecha } from '../../../services/utils';

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

    const { id, nombreFuncionario, fechaSolicitud, tipoSolicitud, estadoSolicitud } = solicitud;

    const derivaciones = solicitud?.derivaciones;


    const tieneDerivaciones = derivaciones && derivaciones.length > 0;


    const tipoMovimiento = tieneDerivaciones ? derivaciones[0].tipoMovimiento : null;

    const idDerivacion = tieneDerivaciones ? derivaciones[0].id : null;

    const estadoDerivacion = tieneDerivaciones ? derivaciones[0].estadoDerivacion : null;

    const recepcionada = tieneDerivaciones ? derivaciones[0].recepcionada : null;


  

    return (
        <>
            <tr className={`d-none d-md-table-row align-middle ${!recepcionada ? 'fw-bold' : ''}`}>
                <td >{id}</td>
                <td className="text-truncate" style={{ maxWidth: '250px' }}>{nombreFuncionario}</td>
                <td>{tipoSolicitud}</td>
                <td>{formatFecha(fechaSolicitud)}</td>
                <td>{estadoSolicitud}</td>
                <td className="text-right">
                    <div className="d-flex justify-content-start">
                        {
                            !recepcionada && (
                                <button
                                    className="btn btn-success btn-sm mr-2"
                                    onClick={() => handlerEntrada(idDerivacion)}
                                    title="Recibir"
                                >
                                    Recibir  <i className="bi bi-check-circle-fill"></i>
                                </button>
                            )
                        }
                        {
                            recepcionada && tipoMovimiento === "VISACION" && estadoDerivacion === "PENDIENTE" && (
                                <button
                                    className="btn btn-outline-primary btn-sm mr-2"
                                    onClick={() => handlerVisar(idDerivacion)}
                                    title="Visar"
                                >
                                    Visar <i className="bi bi-file-earmark-check-fill"></i>
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
                                    onClick={()=>handlerAprobar(idDerivacion)}
                                    className="btn btn-success btn-sm"
                                    title="Firmar"
                                >

                                    Firmar <i className="bi bi-pencil-square"></i>
                                </button>
                            )
                        }{
                            recepcionada && estadoDerivacion === "FINALIZADA" &&
                            (<p className='text-success'><strong>FIRMADA</strong></p>)
                        }
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
                        handlerEntrada={(id) => handlerEntrada(id)}         
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
        solicitante: PropTypes.string.isRequired,
        fechaSolicitud: PropTypes.string.isRequired,
        tipoSolicitud: PropTypes.string.isRequired,
        estadoSolicitud: PropTypes.string.isRequired,

        derivaciones: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired, // Añadir 'id' si es un número
                tipoMovimiento: PropTypes.string.isRequired,
                fechaMovimiento: PropTypes.string.isRequired,
                estadoDerivacion: PropTypes.string.isRequired, // Cambiado a estadoDerivacion
                usuarioMovimiento: PropTypes.string.isRequired,
            })
        ).isRequired,

    }).isRequired,
    onActualizarSolicitud: PropTypes.func.isRequired,
    rutFuncionario: PropTypes.string.isRequired,
    handlerEntrada: PropTypes.func.isRequired,
    handlerVisar: PropTypes.func.isRequired,
    handlerAprobar: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    handleVerDetalleClick: PropTypes.func.isRequired,
};