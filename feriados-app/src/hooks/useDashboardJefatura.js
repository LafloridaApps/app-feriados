import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';
import { getResumenJefe } from '../services/resumenJefe';
import { getDashboardSummary } from '../services/dashboardService';
import { fechaActual, calcularPrimerDiaDelMes } from '../services/utils';

export const useDashboardJefatura = () => {
    const funcionario = useContext(UsuarioContext);
    const { codDepto, rut } = funcionario || {};

    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const [ausenciasProximas, setAusenciasProximas] = useState([]);
    const [ausenciasHoy, setAusenciasHoy] = useState(0);
    const [licenciasHoy, setLicenciasHoy] = useState(0);
    const [proximasLicencias, setProximasLicencias] = useState([]);
    const [departamentosSubrogados, setDepartamentosSubrogados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (codDepto && rut) {
            const obtenerDatosDashboard = async () => {
                setCargando(true);
                try {
                    try {
                        const resumenJefe = await getResumenJefe(rut, codDepto);

                        setSolicitudesPendientes(resumenJefe.solicitudesPendientes || []);
                        setAusenciasProximas(resumenJefe.proximasAusencias || []);
                        setAusenciasHoy(resumenJefe.ausenciasEquipoHoy || 0);
                        setDepartamentosSubrogados(resumenJefe.departamentosSubrogados || []);

                        setError(null);
                    } catch (err) {
                        setError(err);
                        console.error("Error al obtener el resumen del jefe:", err);
                    }

                    try {
                        const hoy = fechaActual();
                        const dashboardData = await getDashboardSummary(codDepto, calcularPrimerDiaDelMes());
                        const licencias = Array.isArray(dashboardData?.licencias) ? dashboardData.licencias : [];

                        setLicenciasHoy(licencias.filter(l => l.fechaInicio <= hoy && l.fechaTermino >= hoy).length);

                        setProximasLicencias(
                            licencias
                                .filter(l => l.fechaInicio >= hoy)
                                .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio))
                                .slice(0, 5)
                        );
                    } catch (err) {
                        console.error("Error al obtener las licencias médicas:", err);
                        setLicenciasHoy(0);
                        setProximasLicencias([]);
                    }
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
        licenciasHoy,
        proximasLicencias,
        departamentosSubrogados, 
        cargando, 
        error 
    };
};