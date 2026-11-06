import { useNavigate } from 'react-router-dom';
import JefeInfoCard from '../JefeInfoCard';
import { formatFecha } from '../../../../../services/utils';

const LicenciasMedicasCard = ({ licenciasHoy, proximasLicencias }) => {
    const navigate = useNavigate();

    return (
        <JefeInfoCard icono="bi bi-heart-pulse-fill" titulo="Licencias Médicas">
            <div className="d-flex flex-column h-100">
                <div className="text-center d-flex flex-column align-items-center justify-content-center mb-2">
                    <div className="absences-count licencias-count">{licenciasHoy}</div>
                    <div className="absences-label">Licencias Hoy</div>
                </div>
                <div className="jefe-info-list-premium flex-grow-1" style={{ maxHeight: '130px', overflowY: 'auto' }}>
                    {proximasLicencias.map((licencia, indice) => (
                        <div key={licencia.id || indice} className="jefe-list-item">
                            <div>
                                <div className="jefe-item-name">{licencia.nombre}</div>
                                <div className="small text-muted">{formatFecha(licencia.fechaInicio)} - {formatFecha(licencia.fechaTermino)}</div>
                            </div>
                            <span className="jefe-item-badge badge-status status-licencia">LICENCIA</span>
                        </div>
                    ))}
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

export default LicenciasMedicasCard;
