import { useState, useEffect } from 'react';
import { searchIsJefeByCodDeptoAndRut } from '../services/jefeService';

export const useIsJefe = (codDepto, rut) => {
    const [esJefe, setEsJefe] = useState(false);
    const [esDirector, setEsDirector] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const shouldFetch = codDepto && rut;


    useEffect(() => {
        if (!shouldFetch) {
            setLoading(false);
            return;
        }

        const verificar = async () => {
            setLoading(true);
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
                setLoading(false);
            }
        };

        verificar();
    }, [shouldFetch, codDepto, rut]);

    return { esJefe, esDirector, loading, error };
};