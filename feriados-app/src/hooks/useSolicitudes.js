import { useContext, useEffect, useState, useCallback } from "react";
import { getAdministrativoByRutAnIdent } from "../services/adminsitrativoService";
import { getFeriadosByRutAndIdent } from "../services/feriadosService";
import { UsuarioContext } from '../context/UsuarioContext';
import useTamanoVentana from './useTamanoVentana';

/**
 * Hook personalizado para gestionar la lógica de la página de solicitudes.
 * Se encarga de obtener los saldos de días administrativos y feriados,
 * y de manejar el estado responsivo.
 */
export const useSolicitudes = () => {
    const { width: ancho } = useTamanoVentana();
    const esMovil = ancho < 768;

    const funcionario = useContext(UsuarioContext);
    const [datosAdministrativos, setDatosAdministrativos] = useState(null);
    const [datosFeriados, setDatosFeriados] = useState(null);
    const [cargando, setCargando] = useState(true);

    const obtenerDatosAdministrativos = useCallback(async (rut, ident, anioActual) => {
        try {
            const respuesta = await getAdministrativoByRutAnIdent(rut, ident);
            
            const resumenFiltrado = {
                maximo: respuesta?.maximo || 0,
                usados: respuesta?.usados || 0,
                saldo: respuesta?.saldo || 0,
                anio: respuesta?.anio || anioActual
            };

            const detalleFiltrado = respuesta.detalle?.filter(item => {
                const fecha = new Date(item.fechaInicio);
                return !Number.isNaN(fecha.getTime()) && fecha.getFullYear() === anioActual;
            }) || [];

            setDatosAdministrativos({ ...respuesta, resumen: resumenFiltrado, detalle: detalleFiltrado });
        } catch (error) {
            console.error('Error al obtener datos administrativos:', error);
        }
    }, []);

    const obtenerDatosFeriados = useCallback(async (rut, ident, anioActual) => {
        try {
            const respuesta = await getFeriadosByRutAndIdent(rut, ident);
            
            const resumenFiltrado = {
                anio: respuesta?.anio || anioActual,
                dias_corresponden: respuesta?.diasCorresponden || 0,
                dias_acumulados: respuesta?.diasAcumulados || 0,
                dias_tomados: respuesta?.diasTomados || 0,
                dias_pendientes: respuesta?.diasPendientes || 0,
                total: respuesta?.total || 0,
                dias_perdidos: respuesta?.diasPerdidos || 0
            };

            const detalleFiltrado = respuesta.detalle?.filter(item => {
                const fecha = new Date(item.fechaInicio);
                return !Number.isNaN(fecha.getTime()) && fecha.getFullYear() === anioActual;
            }) || [];

            setDatosFeriados({ ...respuesta, resumen: resumenFiltrado, detalle: detalleFiltrado });
        } catch (error) {
            console.error('Error al obtener datos feriados:', error);
        }
    }, []);

    useEffect(() => {
        if (!funcionario) return;

        const anioActual = new Date().getFullYear();
        setCargando(true);

        const cargarTodo = async () => {
            await Promise.all([
                obtenerDatosAdministrativos(funcionario.rut, funcionario.ident, anioActual),
                obtenerDatosFeriados(funcionario.rut, funcionario.ident, anioActual)
            ]);
            setCargando(false);
        };

        cargarTodo();
    }, [funcionario, obtenerDatosAdministrativos, obtenerDatosFeriados]);

    return {
        funcionario,
        datosAdministrativos,
        datosFeriados,
        esMovil,
        cargando,
        resumenAdministrativo: datosAdministrativos?.resumen,
        resumenFeriados: datosFeriados?.resumen,
        detalleAdministrativo: datosAdministrativos?.detalle,
        detalleFeriados: datosFeriados?.detalle
    };
};
