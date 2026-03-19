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

                    setError(error);
                    console.error("Error fetching dashboard data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [codDepto, error, rut]); // Dependencies updated

    return { pendingSolicitudes, upcomingAbsences, todayAbsences, subrogatedDepartments, loading, error };
};