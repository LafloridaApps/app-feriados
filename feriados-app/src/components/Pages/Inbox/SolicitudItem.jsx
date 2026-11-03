import DetalleSolicitud from './DetalleSolicitud';
import FilaSolicitudItem from './SolicitudItem/FilaSolicitudItem';
import SolicitudItemMobile from './SolicitudItemMobile';
import PropTypes from 'prop-types';
import { useSolicitudItem } from '../../../hooks/useSolicitudItem';

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
    const item = useSolicitudItem(solicitud, rutFuncionario, onActualizarSolicitud);

    return (
        <>
            <FilaSolicitudItem
                solicitud={solicitud}
                {...item}
                handlerEntrada={handlerEntrada}
                handlerVisar={handlerVisar}
                handlerAprobar={handlerAprobar}
                open={open}
                handleVerDetalleClick={handleVerDetalleClick}
            />
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