import React from 'react';
import './PaginaDashboardMobile.css';

const PaginaDashboardMobile = ({
    mesActual,
    ausencias,
    fechaSeleccionada,
    detallesFechaSeleccionada,
    manejarMesAnterior,
    manejarMesSiguiente,
    manejarClicEmpleado,
    renderizarMiniCalendario,
    mostrarModalEmpleado,
    empleadoSeleccionado,
    manejarCerrarModal,
}) => {

    const renderizarCalendarioMobile = () => {
        const anio = mesActual.getFullYear();
        const mes = mesActual.getMonth();

        const primerDiaMesActual = new Date(anio, mes, 1);
        const primerDiaSemana = primerDiaMesActual.getDay(); // 0 = Domingo, 1 = Lunes, etc.

        const diasCalendario = [];

        // Calcular el día de inicio del calendario (puede ser del mes anterior)
        const diaInicioCalendario = new Date(primerDiaMesActual);
        diaInicioCalendario.setDate(primerDiaMesActual.getDate() - primerDiaSemana);

        // Generar 6 semanas completas (6 * 7 = 42 días)
        for (let i = 0; i < 42; i++) { // 6 semanas * 7 días
            const fechaActual = new Date(diaInicioCalendario);
            const cadenaFecha = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
            const datosAusenciasDia = ausencias[cadenaFecha];
            const tieneAusencia = datosAusenciasDia && Object.keys(datosAusenciasDia.detalles).length > 0;
            const totalAusenciasPorDia = tieneAusencia ? Object.values(datosAusenciasDia.detalles).flat().length : 0;
            const estaSeleccionado = fechaSeleccionada === cadenaFecha;
            const esDelMesActual = fechaActual.getMonth() === mes;

            diasCalendario.push(
                <div
                    key={cadenaFecha}
                    className={`col dashboard-mobile-calendar-day ${tieneAusencia ? 'has-absence' : ''} ${estaSeleccionado ? 'is-selected' : ''} ${!esDelMesActual ? 'text-muted bg-light' : ''}`}
                    onClick={() => manejarClicEmpleado({ fecha: cadenaFecha, detalles: datosAusenciasDia?.detalles || {} })}
                    style={{ cursor: 'pointer' }}
                >
                    <strong>{fechaActual.getDate()}</strong>
                    {totalAusenciasPorDia > 0 && <span className="badge bg-danger rounded-pill mt-1">{totalAusenciasPorDia}</span>}
                </div>
            );
            diaInicioCalendario.setDate(diaInicioCalendario.getDate() + 1);
        }
        return diasCalendario;
    };

    return (
        <div className="dashboard-mobile-container">
            <h2 className="mb-4 dashboard-header">Calendario de Ausencias</h2>
            <div className="card mb-4 dashboard-mobile-card">
                <div className="card-header dashboard-calendar-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <button className="btn btn-light btn-sm" onClick={manejarMesAnterior}>&lt;</button>
                        <h5 className="mb-0">{mesActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h5>
                        <button className="btn btn-light btn-sm" onClick={manejarMesSiguiente}>&gt;</button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row row-cols-7 text-center fw-bold mb-2">
                        <div className="col">Dom</div>
                        <div className="col">Lun</div>
                        <div className="col">Mar</div>
                        <div className="col">Mié</div>
                        <div className="col">Jue</div>
                        <div className="col">Vie</div>
                        <div className="col">Sáb</div>
                    </div>
                    <div className="row row-cols-7 text-center dashboard-calendar-grid-wrapper">
                        {renderizarCalendarioMobile()}
                    </div>
                </div>
                {fechaSeleccionada && detallesFechaSeleccionada && (
                    <div className="card-footer dashboard-mobile-details-section">
                        <h5>Detalles para {fechaSeleccionada}:</h5>
                        {Object.keys(detallesFechaSeleccionada).length > 0 ? (
                            Object.entries(detallesFechaSeleccionada).map(([nombreGrupo, empleados]) => (
                                <div key={nombreGrupo} className="mb-3">
                                    <h6>{nombreGrupo} ({empleados.length} personas)</h6>
                                    <ul className="list-group">
                                        {empleados.map((persona, indice) => (
                                            <li key={indice} className="list-group-item d-flex justify-content-between align-items-center" onClick={() => manejarClicEmpleado(persona)} style={{ cursor: 'pointer' }}>
                                                <div>
                                                    <strong>{persona.nombre}</strong> ({persona.rut})
                                                </div>
                                                <span className="badge bg-info text-dark">{persona.motivo}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p>No hay ausencias para este día.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Employee Details Modal (reusing desktop modal structure for now) */}
            {empleadoSeleccionado && (
                 <div className={`modal fade ${mostrarModalEmpleado ? 'show' : ''}`} style={{ display: mostrarModalEmpleado ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="employeeModalLabel" aria-hidden={!mostrarModalEmpleado}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header dashboard-modal-header">
                                <h5 className="modal-title" id="employeeModalLabel">Detalles del Funcionario</h5>
                                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={manejarCerrarModal}></button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <p><strong>Nombre:</strong> {empleadoSeleccionado.nombre}</p>
                                    <p><strong>RUT:</strong> {empleadoSeleccionado.rut}</p>
                                    <p><strong>Motivo:</strong> {empleadoSeleccionado.motivo}</p>
                                    <p><strong>ID Solicitud:</strong> {empleadoSeleccionado.idSolicitud}</p>
                                    <p><strong>Fecha Aprobación:</strong> {empleadoSeleccionado.fechaAprobacion}</p>
                                    <hr/>
                                    <h6>Período de Ausencia:</h6>
                                    {renderizarMiniCalendario(empleadoSeleccionado.periodoAusencia)}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={manejarCerrarModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {mostrarModalEmpleado && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default PaginaDashboardMobile;
