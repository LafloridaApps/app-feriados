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
        <div className={`card shadow-sm firma-digital-card-redesigned ${firma.statusClass}`}>
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <i className={`icon ${getIcon()}`}></i>
                    <h5 className="card-title mb-0 ms-2">Firma Digital</h5>
                </div>
                <p className="card-text">{firma.mensaje}</p>
                <div className="firma-details-redesigned">
                    <div className="detail-item">
                        <strong>Estado:</strong>
                        <span>{firma.estado}</span>
                    </div>
                    <div className="detail-item">
                        <strong>Vencimiento:</strong>
                        <span>{firma.fechaVencimiento}</span>
                    </div>
                </div>
                <p className="mt-3 text-muted small">Para gestionar su firma, debe comunicarse con DTI.</p>
            </div>
        </div>
    );
};

export default FirmaDigitalCard;