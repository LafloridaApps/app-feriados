import { useContext } from 'react';
import { FirmaDigitalContext } from '../../../../context/FirmaDigitalContext';
import './FirmaDigitalCard.css'; // I will create a new CSS file for the card

const FirmaDigitalCard = () => {
    const { firma } = useContext(FirmaDigitalContext);



    if (!firma) {
        return null;
    }

    const getIcon = () => {
        switch (firma.statusClass) {
            case 'status-ok':
                return 'bi bi-check-circle-fill';
            case 'status-warning':
                return 'bi bi-exclamation-triangle-fill';
            case 'status-danger':
                return 'bi bi-x-circle-fill';
            default:
                return 'bi bi-info-circle-fill';
        }
    };

    return (
        <div className={`premium-card firma-digital-card-redesigned ${firma.statusClass}`}>
                <div className="firma-header">
                    <div className="firma-icon-wrapper">
                        <i className={getIcon()}></i>
                    </div>
                    <h5 className="firma-title">Firma Digital</h5>
                </div>
            
            <p className="firma-mensaje">{firma.mensaje}</p>
            
            <div className="firma-details-premium">
                <div className="firma-detail-row">
                    <span className="firma-detail-label">Estado</span>
                    <span className="firma-detail-value">{firma.estado}</span>
                </div>
                <div className="firma-detail-row">
                    <span className="firma-detail-label">Vencimiento</span>
                    <span className="firma-detail-value">{firma.fechaExpiracion}</span>
                </div>
            </div>
            
            <div className="footer-info">
                <i className="bi bi-info-circle me-1"></i> Para gestionar su firma, debe comunicarse con DTI.
            </div>
        </div>
    );
};

export default FirmaDigitalCard;