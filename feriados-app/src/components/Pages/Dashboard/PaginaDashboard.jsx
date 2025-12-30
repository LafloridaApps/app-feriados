import { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { getDashboardSummary } from '../../../services/dashboardService';
import { getTablaFeriados } from '../../../services/tablaFeriados.js'; // Importar servicio de feriados
import useWindowSize from '../../../hooks/useWindowSize'; // Importar el hook de tamaño de ventana
import PaginaDashboardMobile from './PaginaDashboardMobile'; // Importar el componente móvil
import './PaginaDashboard.css'; // Importar el archivo CSS personalizado

const PaginaDashboard = () => {
    const { width } = useWindowSize(); // Obtener el ancho de la ventana
    const isMobile = width < 768; // Definir el breakpoint para móvil

    const funcionario = useContext(UsuarioContext);

    const [mesActual, setMesActual] = useState(new Date());
    const [ausencias, setAusencias] = useState({});
    const [feriadosSet, setFeriadosSet] = useState(new Set()); // Estado para feriados
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [mostrarModalEmpleado, setMostrarModalEmpleado] = useState(false);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (funcionario && funcionario.codDepto) {
            const fetchAndProcessData = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const anio = mesActual.getFullYear();
                    const mes = (mesActual.getMonth() + 1).toString().padStart(2, '0');
                    const dia = '01';
                    const fechaParaElBackend = `${anio}-${mes}-${dia}`;

                    // Cargar ausencias y feriados en paralelo
                    const [absenceList, feriadosList] = await Promise.all([
                        getDashboardSummary(funcionario.codDepto, fechaParaElBackend),
                        getTablaFeriados()
                    ]);

                    // Procesar feriados en un Set para búsqueda eficiente
                    const processedFeriados = new Set(feriadosList.map(f => f.fecha.split('T')[0]));
                    setFeriadosSet(processedFeriados);

                    if (!Array.isArray(absenceList)) {
                        setError("Los datos de ausencia recibidos no tienen el formato esperado.");
                        setAusencias({});
                        return;
                    }

                    const ausenciasProcesadas = {};
                    absenceList.forEach(empleado => {
                        const inicioParts = empleado.periodoAusencia.fechaInicio.split(/[-/]/);
                        const inicio = new Date(inicioParts[0], inicioParts[1] - 1, inicioParts[2]);
                        const finParts = empleado.periodoAusencia.fechaFin.split(/[-/]/);
                        const fin = new Date(finParts[0], finParts[1] - 1, finParts[2]);
                        let fechaTemporal = new Date(inicio);

                        while (fechaTemporal <= fin) {
                            const dayOfWeek = fechaTemporal.getDay();
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            const cadenaFecha = `${fechaTemporal.getFullYear()}-${(fechaTemporal.getMonth() + 1).toString().padStart(2, '0')}-${fechaTemporal.getDate().toString().padStart(2, '0')}`;
                            const isFeriado = processedFeriados.has(cadenaFecha);

                            // Solo procesar si no es fin de semana y no es feriado
                            if (!isWeekend && !isFeriado) {
                                if (!ausenciasProcesadas[cadenaFecha]) {
                                    ausenciasProcesadas[cadenaFecha] = { detalles: {} };
                                }

                                const nombreGrupo = empleado.nombreGrupo;
                                if (!ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo]) {
                                    ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo] = [];
                                }
                                
                                if (!ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo].some(e => e.rut === empleado.rut)) {
                                    ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo].push(empleado);
                                }
                            }
                            fechaTemporal.setDate(fechaTemporal.getDate() + 1);
                        }
                    });
                    setAusencias(ausenciasProcesadas);
                } catch (err) {
                    setError("No se pudo cargar la información del dashboard.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchAndProcessData();
        } else {
            setLoading(false);
            setError("No se pudo identificar al usuario o su departamento.");
        }
    }, [funcionario, mesActual]); // Recargar si cambia el mes o el funcionario

    // Se elimina la función `filtrarAusenciasPorNivel` ya que el backend se encarga del filtro.
    const detallesFechaSeleccionada = fechaSeleccionada ? ausencias[fechaSeleccionada]?.detalles : null;

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
                <div
                    key={cadenaFecha}
                    className={`col dashboard-calendar-day ${tieneAusencia ? 'has-absence' : ''} ${estaSeleccionado ? 'is-selected' : ''} ${!esDelMesActual ? 'text-muted bg-light' : ''}`}
                    onClick={() => setFechaSeleccionada(cadenaFecha)}
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
    
    const manejarMesAnterior = () => {
        setFechaSeleccionada(null);
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
    };

    const manejarMesSiguiente = () => {
        setFechaSeleccionada(null);
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

    const renderizarMiniCalendario = (periodo) => {
        // Esta función se mantiene igual que en tu versión original
        const inicioParts = periodo.fechaInicio.split(/[-/]/);
        const inicio = new Date(inicioParts[0], inicioParts[1] - 1, inicioParts[2]);
        const finParts = periodo.fechaFin.split(/[-/]/);
        const fin = new Date(finParts[0], finParts[1] - 1, finParts[2]);
        const dias = [];
        const fechaTemporal = new Date(inicio);

        while (fechaTemporal <= fin) {
            const dayOfWeek = fechaTemporal.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const cadenaFecha = `${fechaTemporal.getFullYear()}-${(fechaTemporal.getMonth() + 1).toString().padStart(2, '0')}-${fechaTemporal.getDate().toString().padStart(2, '0')}`;
            const isFeriado = feriadosSet.has(cadenaFecha);

            if (!isWeekend && !isFeriado) {
                dias.push(new Date(fechaTemporal));
            }
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
        <div className="container-fluid mt-4 dashboard-container d-flex flex-column">
            <h2 className="mb-4 dashboard-header">Calendario de Ausencias</h2>

            {loading && (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando ausencias...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && (
                isMobile ? (
                    <PaginaDashboardMobile
                        mesActual={mesActual}
                        ausencias={ausencias}
                        fechaSeleccionada={fechaSeleccionada}
                        detallesFechaSeleccionada={detallesFechaSeleccionada}
                        manejarMesAnterior={manejarMesAnterior}
                        manejarMesSiguiente={manejarMesSiguiente}
                        manejarClicEmpleado={manejarClicEmpleado}
                        renderizarMiniCalendario={renderizarMiniCalendario}
                        mostrarModalEmpleado={mostrarModalEmpleado}
                        empleadoSeleccionado={empleadoSeleccionado}
                        manejarCerrarModal={manejarCerrarModal}
                    />
                ) : (
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
                            <div className="card-footer dashboard-details-footer">
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
                )
            )}

            {/* Employee Details Modal */}
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

export default PaginaDashboard;