import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap'; // Import Bootstrap's Modal
import { DATOS_AUSENCIA_MOCK, NIVEL_USUARIO_MOCK, DEPARTAMENTO_USUARIO_MOCK, DATOS_GRAFICO_MOCK } from './dashboardData';

const PaginaDashboard = () => {
    const [mesActual, setMesActual] = useState(new Date());
    const [ausencias, setAusencias] = useState({});
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [mostrarModalEmpleado, setMostrarModalEmpleado] = useState(false);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

    useEffect(() => {
        const ausenciasProcesadas = {};

        // Iterate through the flat mockAbsenceData array
        DATOS_AUSENCIA_MOCK.forEach(empleado => {
            const inicio = new Date(empleado.periodoAusencia.fechaInicio);
            const fin = new Date(empleado.periodoAusencia.fechaFin);
            let fechaTemporal = new Date(inicio);

            while (fechaTemporal <= fin) {
                const cadenaFecha = `${fechaTemporal.getFullYear()}-${(fechaTemporal.getMonth() + 1).toString().padStart(2, '0')}-${fechaTemporal.getDate().toString().padStart(2, '0')}`;

                if (!ausenciasProcesadas[cadenaFecha]) {
                    ausenciasProcesadas[cadenaFecha] = { detalles: {} };
                }

                const nombreGrupo = empleado.nombreGrupo; // Use the nombreGrupo directly from the empleado object

                if (!ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo]) {
                    ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo] = [];
                }
                // Add empleado only if not already present (check by rut)
                if (!ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo].some(e => e.rut === empleado.rut)) {
                    ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo].push(empleado);
                }
                fechaTemporal.setDate(fechaTemporal.getDate() + 1);
            }
        });
        setAusencias(ausenciasProcesadas);
    }, []); // Run only once on mount

    const obtenerDiasDelMes = (fecha) => {
        const anio = fecha.getFullYear();
        const mes = fecha.getMonth();
        return new Date(anio, mes + 1, 0).getDate();
    };

    const obtenerPrimerDiaDelMes = (fecha) => {
        const anio = fecha.getFullYear();
        const mes = fecha.getMonth();
        return new Date(anio, mes, 1).getDay();
    };

    const filtrarAusenciasPorNivel = (datos) => {
        if (!datos) return null;

        const detallesFiltrados = {};

        switch (NIVEL_USUARIO_MOCK) {
            case 'Director':
                if (datos.detalles[DEPARTAMENTO_USUARIO_MOCK]) {
                    detallesFiltrados[DEPARTAMENTO_USUARIO_MOCK] = datos.detalles[DEPARTAMENTO_USUARIO_MOCK];
                }
                break;
            case 'JefeDepto':
                if (datos.detalles[DEPARTAMENTO_USUARIO_MOCK]) {
                    detallesFiltrados[DEPARTAMENTO_USUARIO_MOCK] = datos.detalles[DEPARTAMENTO_USUARIO_MOCK];
                }
                break;
            case 'Administracion':
                return datos.detalles;
            case 'Alcaldia':
                return datos.detalles;
            default:
                return null;
        }
        return detallesFiltrados;
    };

    const renderizarCalendario = () => {
        const diasEnMes = obtenerDiasDelMes(mesActual);
        const primerDia = obtenerPrimerDiaDelMes(mesActual);
        const diasCalendario = [];

        for (let i = 0; i < primerDia; i++) {
            diasCalendario.push(<div key={`empty-${i}`} className="col border py-2 bg-light"></div>);
        }

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const cadenaFecha = `${mesActual.getFullYear()}-${(mesActual.getMonth() + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            const datosAusenciasDia = ausencias[cadenaFecha];
            const tieneAusencia = datosAusenciasDia && Object.keys(datosAusenciasDia.detalles).length > 0;
            const totalAusenciasPorDia = tieneAusencia ? Object.values(datosAusenciasDia.detalles).flat().length : 0;

            const estaSeleccionado = fechaSeleccionada === cadenaFecha;

            diasCalendario.push(
                <div
                    key={cadenaFecha}
                    className={`col border py-2 ${tieneAusencia ? 'bg-warning text-dark' : ''} ${estaSeleccionado ? 'border-primary border-3' : ''}`}
                    onClick={() => setFechaSeleccionada(cadenaFecha)}
                    style={{ cursor: 'pointer' }}
                >
                    <strong>{dia}</strong><br/>
                    {totalAusenciasPorDia > 0 ? `${totalAusenciasPorDia} personas` : ''}
                </div>
            );
        }
        return diasCalendario;
    };

    const manejarMesAnterior = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
    };

    const manejarMesSiguiente = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));
    };

    const manejarClicEmpleado = (empleado) => {
        setEmpleadoSeleccionado(empleado);
        setMostrarModalEmpleado(true);
    };

    const manejarCerrarModal = () => {
        setMostrarModalEmpleado(false);
        setEmpleadoSeleccionado(null);
    };

    const detallesFechaSeleccionada = fechaSeleccionada ? filtrarAusenciasPorNivel(ausencias[fechaSeleccionada]) : null;

    const renderizarMiniCalendario = (periodo) => {
        const inicio = new Date(periodo.fechaInicio);
        const fin = new Date(periodo.fechaFin);
        const dias = [];
        const fechaTemporal = new Date(inicio);

        while (fechaTemporal <= fin) {
            dias.push(new Date(fechaTemporal));
            fechaTemporal.setDate(fechaTemporal.getDate() + 1);
        }

        const inicioMes = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
        const finMes = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0);

        const diasMiniCalendario = [];
        const primerDiaSemana = inicioMes.getDay();

        for (let i = 0; i < primerDiaSemana; i++) {
            diasMiniCalendario.push(<div key={`mini-empty-${i}`} className="col border py-1 bg-light"></div>);
        }

        for (let dia = 1; dia <= finMes.getDate(); dia++) {
            const diaActual = new Date(inicio.getFullYear(), inicio.getMonth(), dia);
            const estaResaltado = dias.some(d => d.toDateString() === diaActual.toDateString());
            diasMiniCalendario.push(
                <div key={`mini-day-${dia}`} className={`col border py-1 ${estaResaltado ? 'bg-info text-white' : ''}`}>
                    {dia}
                </div>
            );
        }

        return (
            <div className="row row-cols-7 text-center">
                <div className="col fw-bold">Dom</div>
                <div className="col fw-bold">Lun</div>
                <div className="col fw-bold">Mar</div>
                <div className="col fw-bold">Mié</div>
                <div className="col fw-bold">Jue</div>
                <div className="col fw-bold">Vie</div>
                <div className="col fw-bold">Sáb</div>
                {diasMiniCalendario}
            </div>
        );
    };

    return (
        <div className="container-fluid mt-4">
            <h2 className="mb-4">Dashboard de Ausencias</h2>

            {/* Monthly View */}
            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <button className="btn btn-light" onClick={manejarMesAnterior}>&lt;</button>
                        <h4>{mesActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h4>
                        <button className="btn btn-light" onClick={manejarMesSiguiente}>&gt;</button>
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
                    <div className="row row-cols-7 text-center">
                        {renderizarCalendario()}
                    </div>
                </div>
                {detallesFechaSeleccionada && (
                    <div className="card-footer">
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
                            <p>No hay ausencias para este día en sus departamentos.</p>
                        )}
                    </div>
                )}
            </div>

            

            {/* Employee Details Modal */}
            <div className={`modal fade ${mostrarModalEmpleado ? 'show' : ''}`} style={{ display: mostrarModalEmpleado ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="employeeModalLabel" aria-hidden={!mostrarModalEmpleado}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="employeeModalLabel">Detalles del Funcionario</h5>
                            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={manejarCerrarModal}></button>
                        </div>
                        <div className="modal-body">
                            {empleadoSeleccionado && (
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
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={manejarCerrarModal}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            {mostrarModalEmpleado && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default PaginaDashboard;
