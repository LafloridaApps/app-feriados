import { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { getDashboardSummary } from '../../../services/dashboardService';
import { getTablaFeriados } from '../../../services/tablaFeriados.js'; // Importar servicio de feriados
import useWindowSize from '../../../hooks/useWindowSize'; // Importar el hook de tamaño de ventana
import PaginaDashboardMobile from './PaginaDashboardMobile'; // Importar el componente móvil
import CalendarioDashboard from './CalendarioDashboard';
import ModalDetalleFuncionario from './ModalDetalleFuncionario';
import './PaginaDashboard.css'; // Importar el archivo CSS personalizado

const agregarAusencia = (ausenciasProcesadas, cadenaFecha, empleado) => {
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
};

const procesarAusenciaEmpleado = (empleado, ausenciasProcesadas, processedFeriados) => {
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
            agregarAusencia(ausenciasProcesadas, cadenaFecha, empleado);
        }
        fechaTemporal = new Date(fechaTemporal.getFullYear(), fechaTemporal.getMonth(), fechaTemporal.getDate() + 1);
    }
};

const procesarAusencias = (absenceList, processedFeriados) => {
    const ausenciasProcesadas = {};
    absenceList.forEach(empleado => {
        procesarAusenciaEmpleado(empleado, ausenciasProcesadas, processedFeriados);
    });
    return ausenciasProcesadas;
};

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
        if (funcionario?.codDepto) {
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

                    const ausenciasProcesadas = procesarAusencias(absenceList, processedFeriados);
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

    // renderizarCalendario se removió y movió a CalendarioDashboard

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
        if (!periodo?.fechaInicio || !periodo?.fechaFin) return null;
        // Esta función se mantiene igual que en tu versión original
        const inicioParts = periodo.fechaInicio.split(/[-/]/);
        const inicio = new Date(inicioParts[0], inicioParts[1] - 1, inicioParts[2]);
        const finParts = periodo.fechaFin.split(/[-/]/);
        const fin = new Date(finParts[0], finParts[1] - 1, finParts[2]);
        const dias = [];
        let fechaTemporal = new Date(inicio);

        while (fechaTemporal <= fin) {
            const dayOfWeek = fechaTemporal.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const cadenaFecha = `${fechaTemporal.getFullYear()}-${(fechaTemporal.getMonth() + 1).toString().padStart(2, '0')}-${fechaTemporal.getDate().toString().padStart(2, '0')}`;
            const isFeriado = feriadosSet.has(cadenaFecha);

            if (!isWeekend && !isFeriado) {
                dias.push(new Date(fechaTemporal));
            }
            fechaTemporal = new Date(fechaTemporal.getFullYear(), fechaTemporal.getMonth(), fechaTemporal.getDate() + 1);
        }

        const inicioMes = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
        const finMes = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0);

        const diasMiniCalendario = [];
        const primerDiaSemana = inicioMes.getDay();

        for (let i = 0; i < primerDiaSemana; i++) {
            diasMiniCalendario.push(
                <div key={`mini-empty-${i}`} className="col p-1">
                    <div className="w-100 h-100 rounded bg-light" style={{ minHeight: '38px' }}></div>
                </div>
            );
        }

        for (let dia = 1; dia <= finMes.getDate(); dia++) {
            const diaActual = new Date(inicio.getFullYear(), inicio.getMonth(), dia);
            const estaResaltado = dias.some(d => d.toDateString() === diaActual.toDateString());

            const diaVacio = new Date(diaActual).setHours(0, 0, 0, 0);
            const inicioVacio = new Date(inicio).setHours(0, 0, 0, 0);
            const finVacio = new Date(fin).setHours(0, 0, 0, 0);
            const enPeriodo = diaVacio >= inicioVacio && diaVacio <= finVacio;

            let clasesCelda = 'bg-white border text-secondary opacity-50';
            if (estaResaltado) {
                clasesCelda = 'bg-primary text-white shadow-sm fw-bold';
            } else if (enPeriodo) {
                clasesCelda = 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle';
            }

            diasMiniCalendario.push(
                <div key={`mini-day-${dia}`} className="col p-1">
                    <div className={`w-100 h-100 rounded d-flex align-items-center justify-content-center fw-medium user-select-none transition-all ${clasesCelda}`} style={{ minHeight: '38px', fontSize: '0.9rem' }}>
                        {dia}
                    </div>
                </div>
            );
        }

        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const nombreMes = meses[inicio.getMonth()];
        const anio = inicio.getFullYear();

        const fechaInicioStr = `${inicio.getDate().toString().padStart(2, '0')}/${(inicio.getMonth() + 1).toString().padStart(2, '0')}/${inicio.getFullYear()}`;
        const fechaFinStr = `${fin.getDate().toString().padStart(2, '0')}/${(fin.getMonth() + 1).toString().padStart(2, '0')}/${fin.getFullYear()}`;

        return (
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <span className="fw-bold text-dark fs-5 text-capitalize">{nombreMes} {anio}</span>
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-medium">
                        {dias.length} día{dias.length === 1 ? '' : 's'} hábil{dias.length === 1 ? '' : 'es'}
                    </span>
                </div>

                <div className="row row-cols-7 text-center g-0 mb-3">
                    {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map((dia) => (
                        <div key={dia} className="col fw-bold text-muted small pb-2 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>{dia}</div>
                    ))}
                    {diasMiniCalendario}
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-2 gap-sm-4 text-secondary small fw-medium bg-light rounded-3 p-2 border border-light-subtle">
                    <div><span className="text-muted">Inicio:</span> <span className="text-dark fw-bold ms-1">{fechaInicioStr}</span></div>
                    <div><span className="text-muted">Fin:</span> <span className="text-dark fw-bold ms-1">{fechaFinStr}</span></div>
                </div>
            </div>
        );
    };


    return (
        <div className="container-fluid mt-4 dashboard-container d-flex flex-column">
            <h2 className="mb-4 dashboard-header">Calendario de Ausencias</h2>

            {loading && (
                <div className="text-center">
                    <output className="spinner-border">
                        <span className="visually-hidden">Cargando...</span>
                    </output>
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
                    <CalendarioDashboard
                        mesActual={mesActual}
                        ausencias={ausencias}
                        fechaSeleccionada={fechaSeleccionada}
                        setFechaSeleccionada={setFechaSeleccionada}
                        manejarMesAnterior={manejarMesAnterior}
                        manejarMesSiguiente={manejarMesSiguiente}
                        detallesFechaSeleccionada={detallesFechaSeleccionada}
                        manejarClicEmpleado={manejarClicEmpleado}
                    />
                )
            )}

            {/* Employee Details Modal */}
            <ModalDetalleFuncionario
                empleadoSeleccionado={empleadoSeleccionado}
                mostrarModalEmpleado={mostrarModalEmpleado}
                manejarCerrarModal={manejarCerrarModal}
                renderizarMiniCalendario={renderizarMiniCalendario}
            />
        </div>
    );
};

export default PaginaDashboard;