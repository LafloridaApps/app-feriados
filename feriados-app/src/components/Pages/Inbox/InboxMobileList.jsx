import PropTypes from 'prop-types';
import SolicitudItemMobile from './SolicitudItemMobile';

const InboxMobileList = ({
    itemsToDisplay,
    detalleAbiertoId,
    handlerEntrada,
    handlerVisar,
    handlerAprobar,
    rutFuncionario,
    handleActualizarSolicitud,
    handleVerDetalleClick
}) => {
    return (
        <div>
            {itemsToDisplay.map((solicitud) => (
                <SolicitudItemMobile
                    key={solicitud.id}
                    solicitud={solicitud}
                    open={detalleAbiertoId === solicitud.id}
                    handlerEntrada={handlerEntrada}
                    handlerVisar={handlerVisar}
                    handlerAprobar={handlerAprobar}
                    rutFuncionario={rutFuncionario}
                    onActualizarSolicitud={handleActualizarSolicitud}
                    handleVerDetalleClick={() => handleVerDetalleClick(solicitud.id)}
                />
            ))}
            {itemsToDisplay.length === 0 && (
                <div className="p-4 text-center text-muted">
                    No se encontraron solicitudes con los filtros aplicados.
                </div>
            )}
        </div>
    );
};

InboxMobileList.propTypes = {
    itemsToDisplay: PropTypes.array.isRequired,
    detalleAbiertoId: PropTypes.number,
    handlerEntrada: PropTypes.func.isRequired,
    handlerVisar: PropTypes.func.isRequired,
    handlerAprobar: PropTypes.func.isRequired,
    rutFuncionario: PropTypes.string.isRequired,
    handleActualizarSolicitud: PropTypes.func.isRequired,
    handleVerDetalleClick: PropTypes.func.isRequired,
};

export default InboxMobileList;
