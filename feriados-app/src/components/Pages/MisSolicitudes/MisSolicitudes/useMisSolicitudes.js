import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../../../../context/UsuarioContext';
import { getSolicitudesByRut } from '../../../../services/misSolicitudesService';
import useTamanoVentana from '../../../../hooks/useTamanoVentana';

export const useMisSolicitudes = () => {
    const { ancho } = useTamanoVentana(); // Obtener el ancho de la ventana
    const isMobile = ancho < 768; // Definir el breakpoint para móvil

    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDetailId, setOpenDetailId] = useState(null);
    const funcionario = useContext(UsuarioContext);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);


    useEffect(() => {
        const fetSolicitudesByRut = async () => {
            setLoading(true);
            try {
                const response = await getSolicitudesByRut(funcionario.rut, currentPage, pageSize);
                setSolicitudes(Array.isArray(response.solicitudes) ? response.solicitudes : []);
                setTotalPages(response.totalPages);
                setCurrentPage(response.currentPage);
                setTotalElements(response.totalElements);
            } catch {
                // Bloque intencionalmente vacío
            } finally {
                setLoading(false);
            }
        };

        if (funcionario?.rut) {
            void fetSolicitudesByRut();
        }
    }, [funcionario, currentPage, pageSize]);

    const handleToggleDetail = (id) => {
        setOpenDetailId(openDetailId === id ? null : id);
    };

    return {
        funcionario, isMobile, solicitudes, loading, openDetailId, handleToggleDetail,
        currentPage, setCurrentPage, totalPages, totalElements,
    };
};
