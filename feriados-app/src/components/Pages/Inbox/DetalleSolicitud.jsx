import PropTypes from "prop-types";
import { formatFecha } from "../../../services/utils";

const DetalleSolicitud = ({ detalle }) => {

    const { departamentoOrigen, fechaInicio, fechaFin, cantidadDias } = detalle;

    return (
        <div className="row">
            <div className="col-md-6">
                <p><strong>Departamento:</strong> {departamentoOrigen}</p>
                <p><strong>Fecha Inicio:</strong> {formatFecha(fechaInicio)}</p>
                <p><strong>Fecha Fin:</strong> {formatFecha(fechaFin)}</p>
            </div>
            <div className="col-md-6">
                <p><strong>Días Solicitados:</strong> {cantidadDias}</p>
            </div>
        </div>
    );
}

export default DetalleSolicitud;

DetalleSolicitud.propTypes = {
    detalle: PropTypes.shape({
        departamentoOrigen: PropTypes.string.isRequired,
        fechaInicio: PropTypes.string.isRequired,
        fechaFin: PropTypes.string.isRequired,
        cantidadDias: PropTypes.number.isRequired,
    }).isRequired,
};

