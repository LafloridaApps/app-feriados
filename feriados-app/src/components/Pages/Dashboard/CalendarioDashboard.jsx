import React from 'react';
import PropTypes from 'prop-types';
import DetallesAusencia from './DetallesAusencia';

const CalendarioDashboard = ({
    mesActual,
    ausencias,
    fechaSeleccionada,
    setFechaSeleccionada,
    manejarMesAnterior,
    manejarMesSiguiente,
    detallesFechaSeleccionada,
    manejarClicEmpleado
}) => {

    const renderizarCalendario = () => {
        const anio = mesActual.getFullYear();
        const mes = mesActual.getMonth();

        const primerDiaMesActual = new Date(anio, mes, 1);
        const primerDiaSemana = primerDiaMesActual.getDay(); // 0 = Domingo, 1 = Lunes, etc.

        const diasCalendario = [];

        // Calcular el día de inicio del calendario (puede ser del mes anterior)
        const diaInicioCalendario = new Date(primerDiaMesActual);
        diaInicioCalendario.setDate(primerDiaMesActual.getDate() - primerDiaSemana);

        // Generar 6 semanas completas (6 * 7 = 42 días)
        for (let i = 0; i < 42; i++) {
            const fechaActual = new Date(diaInicioCalendario);
            const cadenaFecha = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
            const datosAusenciasDia = ausencias[cadenaFecha];
            const tieneAusencia = datosAusenciasDia && Object.keys(datosAusenciasDia.detalles).length > 0;
            const totalAusenciasPorDia = tieneAusencia ? Object.values(datosAusenciasDia.detalles).flat().length : 0;
            const estaSeleccionado = fechaSeleccionada === cadenaFecha;
            const esDelMesActual = fechaActual.getMonth() === mes;

            diasCalendario.push(
                <button
                    type="button"
                    key={cadenaFecha}
                    className={`dashboard-calendar-day btn-day-override ${tieneAusencia ? 'has-absence' : ''} ${estaSeleccionado ? 'is-selected' : ''} ${esDelMesActual ? '' : 'text-muted'}`}
                    onClick={() => setFechaSeleccionada(cadenaFecha)}
                >
                    <div className="d-flex justify-content-between align-items-start w-100">
                        <strong>{fechaActual.getDate()}</strong>
                        {totalAusenciasPorDia > 0 && (
                            <span className="absence-badge">
                                {totalAusenciasPorDia}
                            </span>
                        )}
                    </div>
                </button>
            );
            diaInicioCalendario.setDate(diaInicioCalendario.getDate() + 1);
        }
        return diasCalendario;
    };

    return (
        <div className="dashboard-card border-0 shadow-lg">
            <div className="dashboard-calendar-header d-flex justify-content-between align-items-center">
                <button className="btn btn-light" onClick={manejarMesAnterior}>
                    <i className="bi bi-chevron-left"></i>
                </button>
                <h4 className="m-0 text-white fw-bold">
                    {mesActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                </h4>
                <button className="btn btn-light" onClick={manejarMesSiguiente}>
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>
            <div className="p-0">
                <div className="row row-cols-7 text-center fw-bold bg-light py-3 border-bottom m-0">
                    <div className="col text-danger small text-uppercase letter-spacing-1">Dom</div>
                    <div className="col text-muted small text-uppercase letter-spacing-1">Lun</div>
                    <div className="col text-muted small text-uppercase letter-spacing-1">Mar</div>
                    <div className="col text-muted small text-uppercase letter-spacing-1">Mié</div>
                    <div className="col text-muted small text-uppercase letter-spacing-1">Jue</div>
                    <div className="col text-muted small text-uppercase letter-spacing-1">Vie</div>
                    <div className="col text-danger small text-uppercase letter-spacing-1">Sáb</div>
                </div>
                <div className="dashboard-calendar-grid-wrapper">
                    {renderizarCalendario()}
                </div>
            </div>
            {detallesFechaSeleccionada && (
                <div className="p-4 bg-white border-top">
                    <DetallesAusencia
                        fechaSeleccionada={fechaSeleccionada}
                        detallesFechaSeleccionada={detallesFechaSeleccionada}
                        manejarClicEmpleado={manejarClicEmpleado}
                    />
                </div>
            )}
        </div>
    );
};

CalendarioDashboard.propTypes = {
    mesActual: PropTypes.instanceOf(Date).isRequired,
    ausencias: PropTypes.object.isRequired,
    fechaSeleccionada: PropTypes.string,
    setFechaSeleccionada: PropTypes.func.isRequired,
    manejarMesAnterior: PropTypes.func.isRequired,
    manejarMesSiguiente: PropTypes.func.isRequired,
    detallesFechaSeleccionada: PropTypes.object,
    manejarClicEmpleado: PropTypes.func.isRequired
};

export default CalendarioDashboard;
