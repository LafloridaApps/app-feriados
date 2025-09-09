import { useState, useEffect, useContext } from 'react'; // Added comment to force re-processing again
import { UsuarioContext } from '../context/UsuarioContext';
import { getResumenJefe } from '../services/resumenJefe';

export const useJefeDashboard = () => {
    const funcionario = useContext(UsuarioContext);
    const { codDepto, rut } = funcionario || {};

    const [pendingSolicitudes, setPendingSolicitudes] = useState([]);
    const [upcomingAbsences, setUpcomingAbsences] = useState([]);
    const [todayAbsences, setTodayAbsences] = useState(0);
    const [subrogatedDepartments, setSubrogatedDepartments] = useState([]);
    const [resumenFunc, setResumenFunc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (codDepto && rut) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const resumen = await getResumenJefe(rut, codDepto); // Use the new function

                    setPendingSolicitudes(resumen.solicitudesPendientes || []);
                    setUpcomingAbsences(resumen.proximasAusencias || []);
                    setTodayAbsences(resumen.ausenciasEquipoHoy || 0);
                    setSubrogatedDepartments(resumen.departamentosSubrogados || []);
                    setResumenFunc({ // Assuming resumenFunc data is part of the summary
                        saldoFeriado: resumen.saldoFeriado,
                        saldoAdministrativo: resumen.saldoAdministrativo,
                        idUltimaSolicitud: resumen.idUltimaSolicitud,
                        estadoUltimaSolicitud: resumen.estadoUltimaSolicitud,
                        solicitudMes: resumen.solicitudMes,
                    });

                } catch (err) {
                    setError(err);
                    console.error("Error fetching dashboard data:", err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [codDepto, rut]); // Dependencies updated

    return { pendingSolicitudes, upcomingAbsences, todayAbsences, subrogatedDepartments, resumenFunc, loading, error };
};