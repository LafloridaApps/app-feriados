import { useState, useEffect } from 'react';
import { searchIsJefeByCodDeptoAndRut } from '../services/jefeService';

export const useEsJefe = (codDepto, rut) => {
    const [esJefe, setEsJefe] = useState(false);
    const [esDirector, setEsDirector] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const debeConsultar = codDepto && rut;

    useEffect(() => {
        if (!debeConsultar) {
            setCargando(false);
            return;
        }

        const verificarJefatura = async () => {
            setCargando(true);
            try {
                const response = await searchIsJefeByCodDeptoAndRut(codDepto, rut);
                setEsJefe(response.esJefe);
                setEsDirector(response.esDirector);
            } catch (err) {
                setError(err);
                setEsJefe(false);
                setEsDirector(false);
                console.error('Error al verificar si es jefe/director:', err);
            } finally {
                setCargando(false);
            }
        };

        verificarJefatura();
    }, [debeConsultar, codDepto, rut]);

    return { esJefe, esDirector, cargando, error };
};