import { useJefeDashboard } from '../../../../hooks/useJefeDashboard';
import { formatFecha } from '../../../../services/utils';

const JefeDashboard = () => {
    const { pendingSolicitudes, upcomingAbsences, todayAbsences, subrogatedDepartments, loading, error } =
        useJefeDashboard();

    if (loading) {
        return <div className="text-center">Cargando datos del dashboard...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error al cargar los datos del dashboard.</div>;


    }


    return (
        <div className="col-12 mt-2">
            <div className="card shadow-sm" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-primary text-white" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <h4 className="mb-0"><i className="bi bi-kanban-fill me-2"></i> Panel de Jefe</h4>
                </div>
                <div className="card-body">
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
                        {/* Columna de Solicitudes Pendientes */}
                        <div className="col-md-4 border-end">
                            <h5 className="text-center mb-3"><i className="bi bi-bell-fill text-warning me-2"></i>Solicitudes Pendientes</h5>
                            <ul className="list-group list-group-flush" style={{ maxHeight: '250px', overflowY: 'auto' }}>
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
                                    <a href="/inbox" className="btn btn-sm btn-outline-primary">Ver todas</a>
                                </div>
                            )}
                        </div>

                        {/* Columna de Próximas Ausencias */}
                        <div className="col-md-4 border-end">
                            <h5 className="text-center mb-3"><i className="bi bi-calendar-event-fill text-info me-2"></i>Próximas Ausencias</h5>
                            <ul className="list-group list-group-flush" style={{ maxHeight: '250px', overflowY: 'auto' }}>
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
                        </div>

                        {/* Columna de Ausencias Hoy */}
                        <div className="col-md-4">
                            <h5 className="text-center mb-3"><i className="bi bi-person-x-fill text-danger me-2"></i>Ausencias del Equipo Hoy</h5>
                            <div className="text-center">
                                <p className="display-4 fw-bold text-danger">{todayAbsences}</p>
                                <p className="text-muted">funcionarios ausentes</p>
                                <a href="/dashboard" className="btn btn-sm btn-outline-danger mt-3">Ver Dashboard</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JefeDashboard;
