import { useNavigate } from 'react-router-dom';
import './AccionesRapidasWidget.css'; // Importar el archivo CSS personalizado

const AccionesRapidasWidget = () => {
    const navigate = useNavigate();

    return (
        <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card acciones-rapidas-widget-card h-100">
                <h5 className="acciones-title">Acciones Rápidas</h5>
                <div className="d-grid gap-3">
                    <button 
                        onClick={() => navigate('/solicitudes')} 
                        className="btn-premium-action btn-primary-action"
                    >
                        <i className="bi bi-file-earmark-plus-fill action-icon"></i>
                        <span>Nueva Solicitud</span>
                    </button>
                    <button 
                        onClick={() => navigate('/mis-solicitudes')} 
                        className="btn-premium-action btn-secondary-action"
                    >
                        <i className="bi bi-collection-play-fill action-icon"></i>
                        <span>Mis Solicitudes</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccionesRapidasWidget;
