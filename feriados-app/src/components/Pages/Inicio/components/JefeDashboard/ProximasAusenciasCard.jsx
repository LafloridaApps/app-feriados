import { useNavigate } from 'react-router-dom';
import JefeInfoCard from '../JefeInfoCard';

const ProximasAusenciasCard = ({ ausenciasProximas }) => {
    const navigate = useNavigate();

    return (
        <JefeInfoCard icono="bi bi-calendar-event-fill" titulo="Próximas Ausencias">
            <div className="d-flex flex-column h-100">
                <div className="jefe-info-list-premium flex-grow-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {ausenciasProximas.length > 0 ? (
                        ausenciasProximas.slice(0, 5).map((ausencia, indice) => (
                            <div key={ausencia.id || indice} className="jefe-list-item">
                                <span className="jefe-item-name">{ausencia.nombreFuncionario}</span>
                            </div>
                        ))
                    ) : (
                        <div className="py-3 text-center text-muted small">No hay ausencias programadas.</div>
                    )}
                </div>
                <button 
                    onClick={() => navigate('/calendario')} 
                    className="jefe-action-btn mt-3 border-0"
                >
                    Ver Calendario
                </button>
            </div>
        </JefeInfoCard>
    );
};

export default ProximasAusenciasCard;
