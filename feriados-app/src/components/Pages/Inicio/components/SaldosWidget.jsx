
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './SaldosWidget.css'; // Importar el archivo CSS personalizado

const SaldosWidget = ({ saldoFeriado, saldoAdministrativo, idUltimaSolicitud, estadoUltimaSolicitud }) => {
    const navigate = useNavigate();

    return (
        <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm rounded-3 p-3 h-100 d-flex flex-column justify-content-between saldos-widget-card">
                <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-wallet-fill text-success me-2 fs-4"></i>
                    <h5 className="card-title mb-0">Tus Saldos y Solicitudes</h5>
                </div>
                <ul className="list-group list-group-flush flex-grow-1">
                    <li className="list-group-item p-0 bg-transparent border-0">
                        <button
                            type="button"
                            className="d-flex justify-content-between align-items-center px-0 py-1 w-100 bg-transparent border-0 text-body"
                            style={{ cursor: 'pointer', textAlign: 'left' }}
                            onClick={() => navigate('/feriados/feriados')}>
                            <span>Feriado Legal:</span>
                            <span className="badge bg-success">{saldoFeriado} días</span>
                        </button>
                    </li>
                    <li className="list-group-item p-0 bg-transparent border-0">
                        <button
                            type="button"
                            className="d-flex justify-content-between align-items-center px-0 py-1 w-100 bg-transparent border-0 text-body"
                            style={{ cursor: 'pointer', textAlign: 'left' }}
                            onClick={() => navigate('/feriados/administrativos')}>
                            <span>Administrativo:</span>
                            <span className="badge bg-success">{saldoAdministrativo} días</span>
                        </button>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 bg-transparent border-0">
                        <span>Última Solicitud:</span>
                        <span className="badge bg-primary">ID {idUltimaSolicitud} - {estadoUltimaSolicitud}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

SaldosWidget.propTypes = {
    saldoFeriado: PropTypes.number,
    saldoAdministrativo: PropTypes.number,
    idUltimaSolicitud: PropTypes.string,
    estadoUltimaSolicitud: PropTypes.string,
};

export default SaldosWidget;
