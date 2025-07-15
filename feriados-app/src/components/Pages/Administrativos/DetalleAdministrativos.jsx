import PropTypes from "prop-types";
import {  formatFechaString } from "../../../services/utils";

const DetalleAdministrativos = ({ detalle }) => {

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped align-middle">
                <thead >
                    <tr>
                        <th><i className="bi bi-hash me-2"></i> N°</th>
                        <th><i className="bi bi-hourglass-split me-2"></i> Duracion</th>
                        <th><i className="bi bi-calendar-check-fill me-2"></i> Fecha Resolución</th>
                        <th><i className="bi bi-calendar-plus-fill me-2"></i> Inicio</th>
                        <th><i className="bi bi-calendar-minus-fill me-2"></i> Término</th>
                    </tr>
                </thead>
                <tbody>
                    {detalle.map(({ numero, periodo, fechaResolucion, fechaInicio, fechaTermino }) => (
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