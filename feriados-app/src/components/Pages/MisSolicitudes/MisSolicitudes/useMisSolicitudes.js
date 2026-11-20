import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../../../../context/UsuarioContext';
import { getSolicitudesByRut } from '../../../../services/misSolicitudesService';
import useTamanoVentana from '../../../../hooks/useTamanoVentana';

export const useMisSolicitudes = () => {
    const { ancho } = useTamanoVentana(); // Obtener el ancho de la ventana
    const isMobile = ancho < 768; // Definir el breakpoint para móvil

    const [solicitudes, setSolicitudes] = useState([]);
    const [revision, setRevision] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openDetailId, setOpenDetailId] = useState(null);
    const funcionario = useContext(UsuarioContext);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);


    useEffect(() => {
        let vigente = true;
        const fetchSolicitudesByRut = async () => {
            setLoading(true);
            try {
                const response = await getSolicitudesByRut(funcionario.rut, currentPage, pageSize);
                if (!vigente) return;
                setSolicitudes(Array.isArray(response.solicitudes) ? response.solicitudes : []);
                setTotalPages(response.totalPages);
                setCurrentPage(response.currentPage);
                setTotalElements(response.totalElements);
            } catch {
                // Bloque intencionalmente vacío
            } finally {
                if (vigente) setLoading(false);
            }
        };

        if (funcionario?.rut) {
            void fetchSolicitudesByRut();
        }
        return () => { vigente = false; };
    }, [funcionario, currentPage, pageSize, revision]);

    const handleToggleDetail = (id) => {
        setOpenDetailId(openDetailId === id ? null : id);
    };

    return {
        funcionario, isMobile, solicitudes, loading, openDetailId, handleToggleDetail,
        actualizarSolicitudes: () => setRevision(valor => valor + 1),
        currentPage, setCurrentPage, totalPages, totalElements,
    };
};
