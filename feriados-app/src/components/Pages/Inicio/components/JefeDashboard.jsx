import { useJefeDashboard } from '../../../../hooks/useJefeDashboard';
import { formatFecha } from '../../../../services/utils';
import JefeInfoCard from './JefeInfoCard';

import './JefeDashboard.css';

const JefeDashboard = () => {
    const { pendingSolicitudes, upcomingAbsences, todayAbsences, subrogatedDepartments, loading, error } =
        useJefeDashboard();

    if (loading) {
        return <div className="text-center">Cargando datos del dashboard...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error al cargar los datos del dashboard.</div>;
    }

    const cardData = [
        {
            icon: 'bi bi-bell-fill text-warning',
            title: 'Solicitudes Pendientes',
            content: (
                <>
                    <ul className="list-group list-group-flush jefe-info-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {pendingSolicitudes.length > 0 ? (
                            pendingSolicitudes.slice(0, 5).map((solicitud, index) => (
                                <li key={solicitud.id || index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{solicitud.nombreFuncionario}</span>
                                    <span className="badge bg-warning text-dark">{solicitud.tipoSolicitud}</span>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-muted">No hay solicitudes pendientes.</li>
                        )}
                    </ul>
                    {pendingSolicitudes.length > 5 && (
                        <div className="text-center mt-2">
                            <a href="/feriados/inbox" className="btn btn-sm btn-outline-primary">Ver todas</a>
                        </div>
                    )}
                </>
            )
        },
        {
            icon: 'bi bi-calendar-event-fill text-info',
            title: 'Próximas Ausencias',
            content: (
                <ul className="list-group list-group-flush jefe-info-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {upcomingAbsences.length > 0 ? (
                        upcomingAbsences.slice(0, 5).map((absence, index) => (
                            <li key={absence.id || index} className="list-group-item">
                                <strong>{absence.nombreFuncionario}</strong> - {formatFecha(absence.fechaAusencia)}
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-muted">No hay ausencias programadas.</li>
                    )}
                </ul>
            )
        },
        {
            icon: 'bi bi-person-x-fill text-danger',
            title: 'Ausencias del Equipo Hoy',
            content: (
                <div className="text-center">
                    <p className="display-4 fw-bold text-danger">{todayAbsences}</p>
                    <p className="text-muted">funcionarios ausentes</p>
                    <a href="/feriados/dashboard" className="btn btn-sm btn-outline-danger mt-3">Ver Dashboard</a>
                </div>
            )
        }
    ];

    return (
        <div className="col-12">
            <div className="card shadow-sm jefe-dashboard-card">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0"><i className="bi bi-kanban-fill me-2"></i> Panel de Jefe</h4>
                </div>
                <div className="card-body p-2">
                    {subrogatedDepartments.length > 0 && (
                        <div className="alert alert-info mb-4" role="alert">
                            <h5 className="alert-heading"><i className="bi bi-person-badge me-2"></i>¡Estás subrogando!</h5>
                            <p>Actualmente estás a cargo de los siguientes departamentos:</p>
                            <ul className="mb-0">
                                {subrogatedDepartments.map((depto, index) => (
                                    <li key={depto.idDepto || index}><strong>{depto.nombreDepartamento}</strong> (Desde: {formatFecha(depto.fechaDesde)} Hasta: {formatFecha(depto.fechaHasta)})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="row">
                        {cardData.map((card, index) => (
                            <JefeInfoCard key={index} icon={card.icon} title={card.title}>
                                {card.content}
                            </JefeInfoCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JefeDashboard;
