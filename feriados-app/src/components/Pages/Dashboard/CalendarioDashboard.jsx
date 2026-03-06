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
        for (let i = 0; i < 42; i++) { // 6 semanas * 7 días
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
                    className={`col dashboard-calendar-day btn-day-override ${tieneAusencia ? 'has-absence' : ''} ${estaSeleccionado ? 'is-selected' : ''} ${esDelMesActual ? '' : 'text-muted bg-light'}`}
                    onClick={() => setFechaSeleccionada(cadenaFecha)}
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
        <div className="card mb-4 dashboard-card h-100">
            <div className="card-header dashboard-calendar-header">
                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn btn-light" onClick={manejarMesAnterior}>&lt;</button>
                    <h4>{mesActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h4>
                    <button className="btn btn-light" onClick={manejarMesSiguiente}>&gt;</button>
                </div>
            </div>
            <div className="card-body d-flex flex-column">
                <div className="row row-cols-7 text-center fw-bold mb-2">
                    <div className="col">Dom</div>
                    <div className="col">Lun</div>
                    <div className="col">Mar</div>
                    <div className="col">Mié</div>
                    <div className="col">Jue</div>
                    <div className="col">Vie</div>
                    <div className="col">Sáb</div>
                </div>
                <div className="dashboard-calendar-grid-wrapper flex-grow-1">
                    {renderizarCalendario()}
                </div>
            </div>
            {detallesFechaSeleccionada && (
                <DetallesAusencia
                    fechaSeleccionada={fechaSeleccionada}
                    detallesFechaSeleccionada={detallesFechaSeleccionada}
                    manejarClicEmpleado={manejarClicEmpleado}
                />
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
