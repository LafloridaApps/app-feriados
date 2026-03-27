import { useFirmaDigital } from '../../../../hooks/useFirmaDigital';
import './FirmaDigitalCard.css'; // I will create a new CSS file for the card

const FirmaDigitalCard = () => {
    const { firma, cargando } = useFirmaDigital();

    if (cargando) {
        return (
            <div className="premium-card firma-digital-card-redesigned d-flex align-items-center justify-content-center">
                <output className="spinner-border text-primary">
                    <span className="visually-hidden">Cargando...</span>
                </output>
            </div>
        );
    }

    if (!firma) {
        return null;
    }

    const { claseEstado, mensaje, estado, fechaVencimiento } = firma;

    const obtenerIcono = () => {
        switch (claseEstado) {
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
        <div className={`premium-card firma-digital-card-redesigned ${claseEstado}`}>
                <div className="firma-header">
                    <div className="firma-icon-wrapper">
                        <i className={obtenerIcono()}></i>
                    </div>
                    <h5 className="firma-title">Firma Digital</h5>
                </div>
            
            <p className="firma-mensaje">{mensaje}</p>
            
            <div className="firma-details-premium">
                <div className="firma-detail-row">
                    <span className="firma-detail-label">Estado</span>
                    <span className="firma-detail-value">{estado}</span>
                </div>
                <div className="firma-detail-row">
                    <span className="firma-detail-label">Vencimiento</span>
                    <span className="firma-detail-value">{fechaVencimiento}</span>
                </div>
            </div>
            
            <div className="footer-info">
                <i className="bi bi-info-circle me-1"></i> Para gestionar su firma, debe comunicarse con DTI.
            </div>
        </div>
    );
};

export default FirmaDigitalCard;