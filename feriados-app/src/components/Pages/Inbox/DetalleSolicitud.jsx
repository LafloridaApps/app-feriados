import PropTypes from "prop-types";
import { formatFecha } from "../../../services/utils";

const DetalleSolicitud = ({ detalle }) => {

    const { nombreDepartamento, fechaInicio, fechaFin, cantidadDias, jornadaInicio, jornadaFin, tipoSolicitud } = detalle;

    let jornada = null;

    if (tipoSolicitud == 'ADMINISTRATIVO') {
        if (jornadaInicio == 'AM' && jornadaFin == 'AM') {
            jornada = "AM"
        } else if (jornadaInicio == 'PM' && jornadaFin == 'PM') {
            jornada = "PM"
        } else {
            jornada = "Completa"
        }
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <p><strong>Departamento :</strong> {nombreDepartamento}</p>
                <p><strong>Fecha Inicio :</strong> {formatFecha(fechaInicio)}</p>
                <p><strong>Fecha Fin :</strong> {formatFecha(fechaFin)}</p>

            </div>
            <div className="col-md-6">
                {
                    jornada && (
                        <p><strong>Jornada : </strong>  {jornada}</p>
                    )
                }
                <p><strong>Días Solicitados :</strong> {cantidadDias}</p>
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

