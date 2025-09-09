import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';
import { getInboxSolicitudesByDepto } from '../services/inboxSolicitudes';
import { useAccionesSolicitud } from './useAccionesSolicitud';
import { useSolicitudesNoLeidas } from './useSolicitudesNoLeidas';

export const useInboxSolicitudes = () => {
    const funcionario = useContext(UsuarioContext);
    const [solicitudes, setSolicitudes] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [filtroAplicado, setFiltroAplicado] = useState({});
    const [rutFuncionario, setRutFuncionario] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(null);
    const [totalElements, setTotalElements] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'descending' });
    const [isSubrogante, setIsSubrogante] = useState(false);
    const [detalleAbiertoId, setDetalleAbiertoId] = useState(null);

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

    const fetchPermisos = useCallback(async () => {
        if (!funcionario) return;

        try {
            const response = await getInboxSolicitudesByDepto(funcionario.codDepto, currentPage);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
            setSolicitudes(response.solicitudes);

            const subrogante = response.solicitudes.some(s => s.subroganciaInfo && s.subroganciaInfo.length > 0);
            setIsSubrogante(subrogante);

        } catch (error) {
            console.error("Error al obtener funcionario:", error);
        }
    }, [currentPage, funcionario]);

    const handleActualizarSolicitud = async () => {
        await fetchPermisos();
        refetch();
    };

    const { handlerEntrada, handlerVisar, handlerAprobar } = useAccionesSolicitud(rutFuncionario, handleActualizarSolicitud, refetch);

    useEffect(() => {
        if (funcionario) {
            setRutFuncionario(funcionario.rut);
        }
    }, [funcionario]);

    useEffect(() => {
        fetchPermisos();
    }, [fetchPermisos]);

    const handleFiltrarSolicitudes = (filtros) => {
        setFiltroAplicado(filtros);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const solicitudesFiltradas = useMemo(() => solicitudes.filter(solicitud => {
        const { anio, fechaInicio, fechaFin, nombreSolicitante, rutSolicitante } = filtroAplicado;
        if (Object.keys(filtroAplicado).length === 0) return true;

        const fechaSolicitudObj = new Date(solicitud.fechaSolicitud);
        const anioSolicitud = fechaSolicitudObj.getFullYear();

        const cumpleAnio = !anio || anioSolicitud === parseInt(anio);
        const cumpleFechaInicio = !fechaInicio || fechaSolicitudObj >= new Date(fechaInicio);
        const cumpleFechaFin = !fechaFin || fechaSolicitudObj <= new Date(fechaFin);
        const cumpleNombre = !nombreSolicitante || solicitud.nombreFuncionario?.toLowerCase().includes(nombreSolicitante.toLowerCase());
        const cumpleRut = !rutSolicitante || String(solicitud.rutSolicitante)?.includes(rutSolicitante);

        return cumpleAnio && cumpleFechaInicio && cumpleFechaFin && cumpleNombre && cumpleRut;
    }), [solicitudes, filtroAplicado]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedItems = useMemo(() => {
        let sortableItems = [...solicitudesFiltradas];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] === null || a[sortConfig.key] === undefined) return 1;
                if (b[sortConfig.key] === null || b[sortConfig.key] === undefined) return -1;

                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [solicitudesFiltradas, sortConfig]);

    return {
        solicitudes,
        isMobile,
        filtroAplicado,
        rutFuncionario,
        currentPage,
        totalPages,
        totalElements,
        sortConfig,
        isSubrogante,
        detalleAbiertoId,
        handleVerDetalleClick,
        fetchPermisos,
        handleActualizarSolicitud,
        handleFiltrarSolicitudes,
        handlePageChange,
        requestSort,
        sortedItems,
        handlerEntrada,
        handlerVisar,
        handlerAprobar,
        solicitudesFiltradas
    };
};