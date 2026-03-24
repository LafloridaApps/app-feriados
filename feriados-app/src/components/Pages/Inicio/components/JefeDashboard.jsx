import { useNavigate } from 'react-router-dom';
import { useJefeDashboard } from '../../../../hooks/useJefeDashboard';
import { formatFecha } from '../../../../services/utils';
import JefeInfoCard from './JefeInfoCard';

import './JefeDashboard.css';

const JefeDashboard = () => {
    const navigate = useNavigate();
    const { pendingSolicitudes, upcomingAbsences, todayAbsences, subrogatedDepartments, loading, error } =
        useJefeDashboard();

    if (loading) {
        return <div className="text-center py-4">Cargando datos del dashboard...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error al cargar los datos del dashboard.</div>;
    }

    const cardData = [
        {
            icon: 'bi bi-bell-fill',
            title: 'Solicitudes Pendientes',
            content: (
                <div className="d-flex flex-column h-100">
                    <div className="jefe-info-list-premium flex-grow-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {pendingSolicitudes.length > 0 ? (
                            pendingSolicitudes.slice(0, 5).map((solicitud, index) => (
                                <div key={solicitud.id || index} className="jefe-list-item">
                                    <span className="jefe-item-name">{solicitud.nombreFuncionario}</span>
                                    <span className="jefe-item-badge badge-status status-pendiente">{solicitud.tipoSolicitud}</span>
                                </div>
                            ))
                        ) : (
                            <div className="py-3 text-center text-muted small">No hay solicitudes pendientes.</div>
                        )}
                    </div>
                    <button 
                        onClick={() => navigate('/feriados/inbox')} 
                        className="jefe-action-btn mt-3 border-0"
                    >
                        Gestionar Inbox
                    </button>
                </div>
            )
        },
        {
            icon: 'bi bi-calendar-event-fill',
            title: 'Próximas Ausencias',
            content: (
                <div className="d-flex flex-column h-100">
                    <div className="jefe-info-list-premium flex-grow-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {upcomingAbsences.length > 0 ? (
                            upcomingAbsences.slice(0, 5).map((absence, index) => (
                                <div key={absence.id || index} className="jefe-list-item">
                                    <span className="jefe-item-name">{absence.nombreFuncionario}</span>
                                </div>
                            ))
                        ) : (
                            <div className="py-3 text-center text-muted small">No hay ausencias programadas.</div>
                        )}
                    </div>
                    <button 
                        onClick={() => navigate('/feriados/dashboard')} 
                        className="jefe-action-btn mt-3 border-0"
                    >
                        Ver Calendario
                    </button>
                </div>
            )
        },
        {
            icon: 'bi bi-person-x-fill',
            title: 'Ausencias Hoy',
            content: (
                <div className="text-center d-flex flex-column align-items-center justify-content-center h-100">
                    <div className="absences-count">{todayAbsences}</div>
                    <div className="absences-label">Funcionarios Ausentes</div>
                    <button 
                        onClick={() => navigate('/feriados/dashboard')} 
                        className="jefe-action-btn mt-4 border-0"
                    >
                        Ver Detalles
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="col-12">
            <div className="jefe-dashboard-wrapper">
                {subrogatedDepartments.length > 0 && (
                    <div className="subrogacion-alert" role="alert">
                        <div className="subrogacion-title">
                            <i className="bi bi-person-badge"></i> ¡Estás subrogando!
                        </div>
                        <p className="mb-2 small">Actualmente estás a cargo de los siguientes departamentos:</p>
                        <div className="subrogacion-list">
                            {subrogatedDepartments.map((depto, index) => (
                                <div key={depto.idDepto || index} className="fw-bold small mb-1">
                                    • {depto.nombreDepartamento} <span className="fw-normal text-muted ms-2">({formatFecha(depto.fechaDesde)} - {formatFecha(depto.fechaHasta)})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="row g-4">
                    {cardData.map((card) => (
                        <JefeInfoCard key={card.title} icon={card.icon} title={card.title}>
                            {card.content}
                        </JefeInfoCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JefeDashboard;
