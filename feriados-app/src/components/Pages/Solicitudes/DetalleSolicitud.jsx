import { PropTypes } from 'prop-types'
import { formatFecha } from '../../../services/utils';

const DetalleSolicitud = ({ fechaInicio, fechaFin, tipo, diasUsar, saldo }) => {
    return (
        <div className="card mt-4">
            <div className="card-header bg-info text-white">
                <i className="bi bi-info-circle-fill me-2"></i> Detalle de la Solicitud
            </div>
            <div className="card-body">
                <ul className="list-group">
                    <li className="list-group-item"><strong><i className="bi bi-tag-fill me-2"></i> Tipo de Solicitud:</strong> {tipo}</li>
                    <li className="list-group-item"><strong><i className="bi bi-calendar-date-fill me-2"></i> Desde:</strong> {formatFecha(fechaInicio)}</li>
                    <li className="list-group-item"><strong><i className="bi bi-calendar-date-fill me-2"></i> Hasta:</strong> {formatFecha(fechaFin)}</li>
                    <li className="list-group-item"><strong><i className="bi bi-hourglass-split me-2"></i> Dias a usar:</strong> {diasUsar}</li>
                    <li className="list-group-item"><strong><i className="bi bi-arrow-left-right me-2"></i> Saldo:</strong> {saldo}</li>
                </ul>
            </div>
        </div>
    );
};

export default DetalleSolicitud;

DetalleSolicitud.propTypes = {
    fechaInicio: PropTypes.string.isRequired,
    fechaFin: PropTypes.string.isRequired,
    tipo: PropTypes.string.isRequired,
    diasUsar: PropTypes.number.isRequired,
    saldo: PropTypes.number.isRequired
};