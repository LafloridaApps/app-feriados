import { useNavigate } from 'react-router-dom';
import JefeInfoCard from '../JefeInfoCard';

const SolicitudesPendientesCard = ({ solicitudesPendientes }) => {
    const navigate = useNavigate();

    return (
        <JefeInfoCard icono="bi bi-bell-fill" titulo="Solicitudes Pendientes">
            <div className="d-flex flex-column h-100">
                <div className="jefe-info-list-premium flex-grow-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {solicitudesPendientes.length > 0 ? (
                        solicitudesPendientes.slice(0, 5).map((solicitud, indice) => (
                            <div key={solicitud.id || indice} className="jefe-list-item">
                                <span className="jefe-item-name">{solicitud.nombreFuncionario}</span>
                                <span className="jefe-item-badge badge-status status-pendiente">{solicitud.tipoSolicitud}</span>
                            </div>
                        ))
                    ) : (
                        <div className="py-3 text-center text-muted small">No hay solicitudes pendientes.</div>
                    )}
                </div>
                <button 
                    onClick={() => navigate('/inbox')} 
                    className="jefe-action-btn mt-3 border-0"
                >
                    Gestionar Inbox
                </button>
            </div>
        </JefeInfoCard>
    );
};

export default SolicitudesPendientesCard;
