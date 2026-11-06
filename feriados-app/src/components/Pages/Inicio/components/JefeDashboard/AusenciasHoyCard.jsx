import { useNavigate } from 'react-router-dom';
import JefeInfoCard from '../JefeInfoCard';

const AusenciasHoyCard = ({ ausenciasHoy }) => {
    const navigate = useNavigate();

    return (
        <JefeInfoCard icono="bi bi-person-x-fill" titulo="Ausencias Hoy">
            <div className="text-center d-flex flex-column align-items-center justify-content-center h-100">
                <div className="absences-count">{ausenciasHoy}</div>
                <div className="absences-label">Funcionarios Ausentes</div>
                <button 
                    onClick={() => navigate('/calendario', { state: { seleccionarHoy: true } })} 
                    className="jefe-action-btn mt-4 border-0"
                >
                    Ver Detalles
                </button>
            </div>
        </JefeInfoCard>
    );
};

export default AusenciasHoyCard;
