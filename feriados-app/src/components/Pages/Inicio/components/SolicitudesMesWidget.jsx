import { useNavigate } from 'react-router-dom';
import { useFuncionarioResumen } from '../../../../hooks/useFuncionarioResumen';
import './SolicitudesMesWidget.css'; // Importar el archivo CSS personalizado

const SolicitudesMesWidget = () => {
    const navigate = useNavigate();
    const { resumenFuncionario, cargando } = useFuncionarioResumen();

    if (cargando) {
        return (
            <div className="col-12 col-md-6 col-lg-4">
                <div className="premium-card solicitudes-mes-card h-100 d-flex align-items-center justify-content-center">
                    <output className="spinner-border text-primary">
                        <span className="visually-hidden">Cargando...</span>
                    </output>
                </div>
            </div>
        );
    }

    const solicitudes = resumenFuncionario?.solicitudMes || [];

    return (
        <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card solicitudes-mes-card h-100 d-flex flex-column">
                <div className="solicitudes-header">
                    <div className="solicitudes-icon-wrapper">
                        <i className="bi bi-calendar-check"></i>
                    </div>
                    <h5 className="solicitudes-title">Solicitudes del Mes</h5>
                </div>

                <div className="solicitudes-list-premium">
                    {solicitudes.length > 0 ? (
                        <div className="d-flex flex-column">
                            {solicitudes.slice(0, 3).map(({ tipoSolicitud, estado, fechaSolicitud, idSolicitud }) => (
                                <div key={idSolicitud} className="solicitud-item-premium">
                                    <div className="solicitud-info">
                                        <span className="solicitud-type">{tipoSolicitud}</span>
                                        <span className="solicitud-date">{fechaSolicitud}</span>
                                    </div>
                                    <span className={`badge-status status-${estado.toLowerCase()}`}>
                                        {estado}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center py-4">
                            <p className="text-muted small mb-0">No hay solicitudes este mes.</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => navigate('/mis-solicitudes')}
                    className="ver-todas-btn border-0"
                >
                    Ver Todas
                </button>
            </div>
        </div>
    );
};

export default SolicitudesMesWidget;
