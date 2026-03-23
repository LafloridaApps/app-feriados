import React from 'react';
import PropTypes from 'prop-types';
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

            const extraLabel = tieneAusencia ? `, ${totalAusenciasPorDia} ausencias` : '';
            const ariaLabel = `Fecha ${fechaActual.toLocaleDateString()}${extraLabel}`;
            diasCalendario.push(
                <button
                    key={cadenaFecha}
                    className={`col dashboard-mobile-calendar-day ${tieneAusencia ? 'has-absence' : ''} ${estaSeleccionado ? 'is-selected' : ''} ${esDelMesActual ? '' : 'text-muted bg-light'}`}
                    onClick={() => manejarClicEmpleado({ fecha: cadenaFecha, detalles: datosAusenciasDia?.detalles || {} })}
                    aria-label={ariaLabel}
                    type="button"
                >
                    <strong>{fechaActual.getDate()}</strong>
                    {totalAusenciasPorDia > 0 && <span className="badge bg-danger rounded-pill mt-1">{totalAusenciasPorDia}</span>}
                </button>
            );
            diaInicioCalendario.setDate(diaInicioCalendario.getDate() + 1);
        }
        return diasCalendario;
    };

    return (
        <div className="dashboard-mobile-container">
            <h2 className="dashboard-header">Calendario de Ausencias</h2>
            <div className="dashboard-mobile-card shadow-lg">
                <div className="dashboard-calendar-header p-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <button className="btn btn-light btn-sm" onClick={manejarMesAnterior}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <h5 className="mb-0 text-white fw-bold">
                            {mesActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                        </h5>
                        <button className="btn btn-light btn-sm" onClick={manejarMesSiguiente}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div className="p-3">
                    <div className="row row-cols-7 text-center fw-bold mb-2 small text-muted text-uppercase letter-spacing-1">
                        <div className="col text-danger">Do</div>
                        <div className="col">Lu</div>
                        <div className="col">Ma</div>
                        <div className="col">Mi</div>
                        <div className="col">Ju</div>
                        <div className="col">Vi</div>
                        <div className="col text-danger">Sá</div>
                    </div>
                    <div className="row row-cols-7 text-center dashboard-calendar-grid-wrapper rounded-3 overflow-hidden border">
                        {renderizarCalendarioMobile()}
                    </div>
                </div>
                {fechaSeleccionada && detallesFechaSeleccionada && (
                    <div className="dashboard-mobile-details-section">
                        <h5 className="d-flex align-items-center">
                            <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                            Detalles: {fechaSeleccionada}
                        </h5>
                        {Object.keys(detallesFechaSeleccionada).length > 0 ? (
                            Object.entries(detallesFechaSeleccionada).map(([nombreGrupo, empleados]) => (
                                <div key={nombreGrupo} className="mb-4">
                                    <h6>{nombreGrupo}</h6>
                                    <div className="d-flex flex-column gap-2">
                                        {empleados.map((persona) => (
                                            <button
                                                key={`${persona.rut}-${persona.idSolicitud}`}
                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 shadow-sm rounded-4 p-3"
                                                onClick={() => manejarClicEmpleado(persona)}
                                                type="button"
                                            >
                                                <div>
                                                    <div className="fw-bold text-dark">{persona.nombre}</div>
                                                    <div className="small text-muted">{persona.rut}</div>
                                                </div>
                                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle">
                                                    {persona.motivo}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 bg-light rounded-4">
                                <i className="bi bi-calendar-check fs-2 text-muted d-block mb-2"></i>
                                <p className="mb-0 text-muted fw-medium">No hay ausencias para este día.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

PaginaDashboardMobile.propTypes = {
    mesActual: PropTypes.instanceOf(Date).isRequired,
    ausencias: PropTypes.object.isRequired,
    fechaSeleccionada: PropTypes.string,
    detallesFechaSeleccionada: PropTypes.object,
    manejarMesAnterior: PropTypes.func.isRequired,
    manejarMesSiguiente: PropTypes.func.isRequired,
    manejarClicEmpleado: PropTypes.func.isRequired,
    renderizarMiniCalendario: PropTypes.func.isRequired,
    mostrarModalEmpleado: PropTypes.bool.isRequired,
    empleadoSeleccionado: PropTypes.object,
    manejarCerrarModal: PropTypes.func.isRequired,
};

export default PaginaDashboardMobile;
