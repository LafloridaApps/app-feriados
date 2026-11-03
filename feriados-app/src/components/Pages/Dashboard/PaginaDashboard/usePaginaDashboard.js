import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { UsuarioContext } from '../../../../context/UsuarioContext';
import { getDashboardSummary } from '../../../../services/dashboardService';
import { getTablaFeriados } from '../../../../services/tablaFeriados.js';
import useTamanoVentana from '../../../../hooks/useTamanoVentana';
import { procesarAusencias } from '../PaginaCalendarioAusencias/ausenciasUtils';

export const usePaginaDashboard = () => {
    const { width } = useTamanoVentana();
    const location = useLocation();
    const isMobile = width < 768; // Definir el breakpoint para móvil
    const detallesRef = useRef(null);

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

            void fetchAndProcessData();
        } else {
            setLoading(false);
            setError("No se pudo identificar al usuario o su departamento.");
        }
    }, [funcionario, mesActual]); // Recargar si cambia el mes o el funcionario

    // Effect to handle auto-selection and scroll if coming from JefeDashboard
    useEffect(() => {
        if (!loading && location.state?.seleccionarHoy) {
            const hoy = new Date();
            const anio = hoy.getFullYear();
            const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
            const dia = hoy.getDate().toString().padStart(2, '0');
            const cadenaHoy = `${anio}-${mes}-${dia}`;
            
            // Set today's date as selected
            setFechaSeleccionada(cadenaHoy);
            
            // Scroll to details after a small delay to ensure rendering
            setTimeout(() => {
                detallesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [loading, location.state]);

    const detallesFechaSeleccionada = fechaSeleccionada ? ausencias[fechaSeleccionada]?.detalles : null;


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

    return {
        isMobile,
        detallesRef,
        mesActual,
        ausencias,
        feriadosSet,
        fechaSeleccionada,
        setFechaSeleccionada,
        mostrarModalEmpleado,
        empleadoSeleccionado,
        loading,
        error,
        detallesFechaSeleccionada,
        manejarMesAnterior,
        manejarMesSiguiente,
        manejarClicEmpleado,
        manejarCerrarModal
    };
};
