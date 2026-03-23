import PropTypes from "prop-types";
import { formatFechaString } from "../../../services/utils";

const DetalleAdministrativos = ({ detalle }) => {

    return (
        <div className="table-responsive">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th>N° Solicitud</th>
                        <th className="text-center">Duración</th>
                        <th>Fecha Resolución</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Término</th>
                    </tr>
                </thead>
                <tbody>
                    {detalle.map(({ numero, periodo, fechaResolucion, fechaInicio, fechaTermino }) => (
                        <tr key={numero}>
                            <td className="fw-bold text-primary">#{numero}</td>
                            <td className="text-center">{periodo}</td>
                            <td>{formatFechaString(fechaResolucion)}</td>
                            <td>
                                <span className="d-flex align-items-center gap-2">
                                    <i className="bi bi-calendar-check text-success small"></i>
                                    {formatFechaString(fechaInicio)}
                                </span>
                            </td>
                            <td>
                                <span className="d-flex align-items-center gap-2">
                                    <i className="bi bi-calendar-x text-danger small"></i>
                                    {formatFechaString(fechaTermino)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

DetalleAdministrativos.propTypes = {
    detalle: PropTypes.arrayOf(
        PropTypes.shape({
            numero: PropTypes.number.isRequired,
            periodo: PropTypes.number.isRequired,
            fecha_resolucion: PropTypes.string.isRequired,
            fecha_inicio: PropTypes.string.isRequired,
            fecha_termino: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default DetalleAdministrativos;