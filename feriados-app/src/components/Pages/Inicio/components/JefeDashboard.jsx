import { useNavigate } from 'react-router-dom';
import { useDashboardJefatura } from '../../../../hooks/useDashboardJefatura';
import { formatFecha } from '../../../../services/utils';
import JefeInfoCard from './JefeInfoCard';

import './JefeDashboard.css';

const JefeDashboard = () => {
    const navigate = useNavigate();
    const { 
        solicitudesPendientes, 
        ausenciasProximas, 
        ausenciasHoy, 
        departamentosSubrogados, 
        cargando, 
        error 
    } = useDashboardJefatura();

    if (cargando) {
        return <div className="text-center py-4">Cargando datos del dashboard...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error al cargar los datos del dashboard.</div>;
    }

    const datosTarjetas = [
        {
            icon: 'bi bi-bell-fill',
            title: 'Solicitudes Pendientes',
            contenido: (
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
            )
        },
        {
            icon: 'bi bi-calendar-event-fill',
            title: 'Próximas Ausencias',
            contenido: (
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
                        onClick={() => navigate('/dashboard')} 
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
            contenido: (
                <div className="text-center d-flex flex-column align-items-center justify-content-center h-100">
                    <div className="absences-count">{ausenciasHoy}</div>
                    <div className="absences-label">Funcionarios Ausentes</div>
                    <button 
                        onClick={() => navigate('/dashboard', { state: { seleccionarHoy: true } })} 
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
                {departamentosSubrogados.length > 0 && (
                    <div className="subrogacion-alert" role="alert">
                        <div className="subrogacion-title">
                            <i className="bi bi-person-badge"></i> ¡Estás subrogando!
                        </div>
                        <p className="mb-2 small">Actualmente estás a cargo de los siguientes departamentos:</p>
                        <div className="subrogacion-list">
                            {departamentosSubrogados.map((departamento, indice) => (
                                <div key={departamento.idDepto || indice} className="fw-bold small mb-1">
                                    • {departamento.nombreDepartamento} <span className="fw-normal text-muted ms-2">({formatFecha(departamento.fechaDesde)} - {formatFecha(departamento.fechaHasta)})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="row g-4">
                    {datosTarjetas.map((tarjeta) => (
                        <JefeInfoCard key={tarjeta.title} icono={tarjeta.icon} titulo={tarjeta.title}>
                            {tarjeta.contenido}
                        </JefeInfoCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JefeDashboard;
