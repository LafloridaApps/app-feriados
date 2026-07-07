import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';
import { getInboxSolicitudesByDepto } from '../services/inboxSolicitudes';
import { buscarSolicitudes } from '../services/busquedaService';
import { useAccionesSolicitud } from './useAccionesSolicitud';
import { useSolicitudesNoLeidas } from './useSolicitudesNoLeidas';

const tieneFiltrosActivos = (filtros) => {
    return Object.values(filtros).some(v => v !== undefined && v !== null && v !== '');
};

export const useInboxSolicitudes = () => {
    const funcionario = useContext(UsuarioContext);
    const [solicitudes, setSolicitudes] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [filtroAplicado, setFiltroAplicado] = useState({});
    const [rutFuncionario, setRutFuncionario] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(null);
    const [totalElements, setTotalElements] = useState(null);
    const [modoBusqueda, setModoBusqueda] = useState(false);

    const [noLeidas, setNoLeidas] = useState(false);
    const [isSubrogante, setIsSubrogante] = useState(false);
    const [detalleAbiertoId, setDetalleAbiertoId] = useState(null);
    const anioActual = new Date().getFullYear();
    const [anioFiltro, setAnioFiltro] = useState(anioActual.toString());
    const [aniosDisponibles, setAniosDisponibles] = useState(() => {
        const years = [];
        for (let y = 2024; y <= anioActual; y++) years.push(y.toString());
        return years;
    });

    const { refetch } = useSolicitudesNoLeidas();

    const handleVerDetalleClick = (idSolicitud) => {
        setDetalleAbiertoId(detalleAbiertoId === idSolicitud ? null : idSolicitud);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchBusqueda = useCallback(async () => {
        if (!funcionario) return;
        try {
            const { fechaFin, ...resto } = filtroAplicado;
            const response = await buscarSolicitudes(funcionario.codDepto, {
                ...resto,
                fechaTermino: fechaFin || undefined,
                pageNumber: currentPage,
            });
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
            setSolicitudes(response.solicitudes || []);
            setIsSubrogante(false);
        } catch (error) {
            console.error('Error al buscar solicitudes:', error);
        }
    }, [funcionario, filtroAplicado, currentPage]);

    const fetchPermisos = useCallback(async () => {
        if (!funcionario) return;

        try {
            const response = await getInboxSolicitudesByDepto(funcionario.codDepto, currentPage, funcionario.rut, { noLeidas, anio: anioFiltro });
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
            setSolicitudes(response.solicitudes);

            const subrogante = response.solicitudes.some(s => s.subroganciaInfo && s.subroganciaInfo.length > 0);
            setIsSubrogante(subrogante);

            const yearsFromResponse = [...new Set(response.solicitudes.map(s => {
                const fecha = new Date(s.fechaSolicitud);
                return fecha.getFullYear().toString();
            }).filter(Boolean))];
            if (yearsFromResponse.length > 0) {
                setAniosDisponibles(prev => {
                    const merged = [...new Set([...prev, ...yearsFromResponse])];
                    return merged.sort((a, b) => b - a);
                });
            }

        } catch (error) {
            console.error("Error al obtener funcionario:", error);
        }
    }, [currentPage, funcionario, noLeidas, anioFiltro]);

    const handleActualizarSolicitud = async () => {
        if (modoBusqueda) {
            await fetchBusqueda();
        } else {
            await fetchPermisos();
        }
        refetch();
    };

    const { handlerEntrada, handlerVisar, handlerAprobar } = useAccionesSolicitud(rutFuncionario, handleActualizarSolicitud, refetch);

    useEffect(() => {
        if (funcionario) {
            setRutFuncionario(funcionario.rut);
        }
    }, [funcionario]);

    useEffect(() => {
        if (modoBusqueda) {
            fetchBusqueda();
        } else {
            fetchPermisos();
        }
    }, [fetchBusqueda, fetchPermisos, modoBusqueda]);

    const handleFiltrarSolicitudes = (filtros) => {
        setFiltroAplicado(filtros);
        setCurrentPage(0);
        setModoBusqueda(tieneFiltrosActivos(filtros));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const solicitudesFiltradas = useMemo(() => {
        if (modoBusqueda) return solicitudes;
        return solicitudes.filter(solicitud => {
            const { fechaInicio, fechaFin, nombreSolicitante, rutSolicitante } = filtroAplicado;
            if (Object.keys(filtroAplicado).length === 0) return true;

            const fechaSolicitudObj = new Date(solicitud.fechaSolicitud);

            const cumpleFechaInicio = !fechaInicio || fechaSolicitudObj >= new Date(fechaInicio);
            const cumpleFechaFin = !fechaFin || fechaSolicitudObj <= new Date(fechaFin);
            const cumpleNombre = !nombreSolicitante || solicitud.nombreFuncionario?.toLowerCase().includes(nombreSolicitante.toLowerCase());
            const cumpleRut = !rutSolicitante || String(solicitud.rutSolicitante)?.includes(rutSolicitante);

            return cumpleFechaInicio && cumpleFechaFin && cumpleNombre && cumpleRut;
        });
    }, [solicitudes, filtroAplicado, modoBusqueda]);

    const sortedItems = solicitudesFiltradas;

    return {
        solicitudes,
        isMobile,
        filtroAplicado,
        rutFuncionario,
        currentPage,
        totalPages,
        totalElements,
        isSubrogante,
        detalleAbiertoId,
        handleVerDetalleClick,
        fetchPermisos,
        handleActualizarSolicitud,
        handleFiltrarSolicitudes,
        handlePageChange,
        sortedItems,
        handlerEntrada,
        handlerVisar,
        handlerAprobar,
        solicitudesFiltradas,
        noLeidas,
        setNoLeidas,
        anioFiltro,
        setAnioFiltro,
        aniosDisponibles,
        modoBusqueda,
    };
};