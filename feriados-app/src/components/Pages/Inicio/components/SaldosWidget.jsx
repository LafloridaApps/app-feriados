
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './SaldosWidget.css'; // Importar el archivo CSS personalizado

const SaldosWidget = ({ saldoFeriado, saldoAdministrativo, idUltimaSolicitud, estadoUltimaSolicitud }) => {
    const navigate = useNavigate();

    return (
        <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card saldos-widget-card h-100">
                <div className="d-flex align-items-center mb-1">
                    <div className="saldos-icon-wrapper">
                        <i className="bi bi-wallet2"></i>
                    </div>
                    <h5 className="saldos-title">Mis Saldos</h5>
                </div>
                
                <div className="saldos-list">
                    <div className="saldo-item">
                        <button
                            type="button"
                            className="saldo-btn"
                            onClick={() => navigate('/feriados/feriados')}>
                            <span className="saldo-label">Feriado Legal</span>
                            <span className="badge-saldo">{saldoFeriado} días</span>
                        </button>
                    </div>
                    
                    <div className="saldo-item">
                        <button
                            type="button"
                            className="saldo-btn"
                            onClick={() => navigate('/feriados/administrativos')}>
                            <span className="saldo-label">Administrativo</span>
                            <span className="badge-saldo">{saldoAdministrativo} días</span>
                        </button>
                    </div>
                </div>

                <div className="ultima-solicitud-row d-flex justify-content-between align-items-center">
                    <span>Última Solicitud:</span>
                    <span className="badge-ultima">ID {idUltimaSolicitud} - {estadoUltimaSolicitud}</span>
                </div>
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
