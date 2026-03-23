import PropTypes from "prop-types";
import { formatFechaString } from "../../../services/utils";

const DetalleFeriados = ({ detalle }) => {

    return (
        <div className="table-responsive">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th>N° Solicitud</th>
                        <th className="text-center">Periodo</th>
                        <th>Fecha Resolución</th>
                        <th>Desde</th>
                        <th>Hasta</th>
                    </tr>
                </thead>
                <tbody>
                    {detalle.map(({ fechaResolucion, fechaInicio, fechaTermino, numero, periodo }) => (
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

DetalleFeriados.propTypes = {
    detalle: PropTypes.arrayOf(
        PropTypes.shape({
            numero: PropTypes.number.isRequired,
            periodo: PropTypes.number.isRequired,
            fechaResolucion: PropTypes.string.isRequired,
            fechaInicio: PropTypes.string.isRequired,
            fechaTermino: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default DetalleFeriados;