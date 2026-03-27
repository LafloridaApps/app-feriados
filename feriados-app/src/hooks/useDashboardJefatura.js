import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';
import { getResumenJefe } from '../services/resumenJefe';

export const useDashboardJefatura = () => {
    const funcionario = useContext(UsuarioContext);
    const { codDepto, rut } = funcionario || {};

    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const [ausenciasProximas, setAusenciasProximas] = useState([]);
    const [ausenciasHoy, setAusenciasHoy] = useState(0);
    const [departamentosSubrogados, setDepartamentosSubrogados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (codDepto && rut) {
            const obtenerDatosDashboard = async () => {
                try {
                    setCargando(true);
                    const resumenJefe = await getResumenJefe(rut, codDepto);

                    setSolicitudesPendientes(resumenJefe.solicitudesPendientes || []);
                    setAusenciasProximas(resumenJefe.proximasAusencias || []);
                    setAusenciasHoy(resumenJefe.ausenciasEquipoHoy || 0);
                    setDepartamentosSubrogados(resumenJefe.departamentosSubrogados || []);

                    setError(null);
                } catch (err) {
                    setError(err);
                    console.error("Error al obtener datos del dashboard de jefatura:", err);
                } finally {
                    setCargando(false);
                }
            };

            obtenerDatosDashboard();
        }
    }, [codDepto, rut]);

    return { 
        solicitudesPendientes, 
        ausenciasProximas, 
        ausenciasHoy, 
        departamentosSubrogados, 
        cargando, 
        error 
    };
};