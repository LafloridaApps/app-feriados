import PropTypes from "prop-types";
import { formatFechaString } from "../../../services/utils";

const DetalleFeriados = ({ detalle }) => {

    return (
        <div className="card">
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th><i className="bi bi-hash me-2"></i> Numero</th>
                                <th><i className="bi bi-calendar-week-fill me-2"></i> Periodo</th>
                                <th><i className="bi bi-calendar-check-fill me-2"></i> Fecha Resolución</th>
                                <th><i className="bi bi-calendar-plus-fill me-2"></i> Fecha Inicio</th>
                                <th><i className="bi bi-calendar-minus-fill me-2"></i> Fecha Término</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalle.map(({ fechaResolucion, fechaInicio, fechaTermino, numero, periodo }) => (
                                <tr key={numero}>
                                    <td>{numero}</td>
                                    <td>{periodo}</td>
                                    <td>{formatFechaString(fechaResolucion)}</td>
                                    <td>{formatFechaString(fechaInicio)}</td>
                                    <td>{formatFechaString(fechaTermino)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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