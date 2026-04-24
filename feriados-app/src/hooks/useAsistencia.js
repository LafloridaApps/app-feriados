import { useState, useEffect, useCallback, useContext } from "react";
import { UsuarioContext } from "../context/UsuarioContext";
import { getAsistencia } from "../services/asistenciaService";

/**
 * Hook personalizado para gestionar la lógica de negocio de la página de asistencia.
 * Maneja el estado de los filtros (mes/año), la obtención de datos desde la API
 * y el formateo de los datos para su visualización.
 */
export const useAsistencia = () => {
    const funcionario = useContext(UsuarioContext);
    
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [datosAsistencia, setDatosAsistencia] = useState([]);
    const [cargando, setCargando] = useState(false);

    /**
     * Obtiene los registros de asistencia desde el servicio.
     */
    const obtenerAsistencia = useCallback(async () => {
        if (!funcionario?.rut) return;

        setCargando(true);
        try {
            const primerDia = new Date(anio, mes - 1, 1);
            const ultimoDia = new Date(anio, mes, 0);

            const formatearFechaParam = (fecha) => {
                const y = fecha.getFullYear();
                const m = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const d = fecha.getDate().toString().padStart(2, '0');
                return `${y}-${m}-${d}`;
            };

            const fechaInicio = formatearFechaParam(primerDia);
            const fechaFin = formatearFechaParam(ultimoDia);

            const data = await getAsistencia(
                funcionario.rut,
                funcionario.ident || 1,
                fechaInicio,
                fechaFin
            );
            setDatosAsistencia(data || []);
        } catch (error) {
            console.error("Error al obtener asistencia:", error);
        } finally {
            setCargando(false);
        }
    }, [mes, anio, funcionario]);

    // Efecto para recargar los datos cuando cambian los filtros
    useEffect(() => {
        obtenerAsistencia();
    }, [obtenerAsistencia]);

    /**
     * Formatea una cadena de fecha/hora para mostrar solo la hora (HH:mm).
     */
    const formatearHora = (fechaHoraStr) => {
        if (!fechaHoraStr) return '-';
        const partes = fechaHoraStr.split(' ');
        if (partes.length < 2) return '-';
        return partes[1].substring(0, 5);
    };

    /**
     * Formatea una cadena de fecha/hora para mostrar solo la fecha (YYYY-MM-DD).
     */
    const formatearFecha = (fechaHoraStr) => {
        if (!fechaHoraStr) return '-';
        const partes = fechaHoraStr.split(' ');
        return partes[0];
    };

    /**
     * Formatea un valor numérico a cadena con dos decimales.
     */
    const formatearDecimal = (val) => {
        if (!val) return '0.00';
        return Number.parseFloat(val).toFixed(2);
    };

    /**
     * Calcula los totales acumulados de horas trabajadas y extras.
     */
    const totales = datosAsistencia.reduce((acc, curr) => {
        acc.hatr += Number.parseFloat(curr.hatr || 0);
        acc.h25 += Number.parseFloat(curr.hext25 || 0);
        acc.h50 += Number.parseFloat(curr.hext50 || 0);
        return acc;
    }, { hatr: 0, h25: 0, h50: 0 });

    return {
        funcionario,
        mes,
        setMes,
        anio,
        setAnio,
        datosAsistencia,
        cargando,
        obtenerAsistencia,
        formatearHora,
        formatearFecha,
        formatearDecimal,
        totales
    };
};
