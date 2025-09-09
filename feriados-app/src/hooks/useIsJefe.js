import { useState, useEffect } from 'react';
import { searchIsJefeByCodDeptoAndRut } from '../services/jefeService';

export const useIsJefe = (codDepto, rut) => {
    const [esJefe, setEsJefe] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (codDepto && rut) {
            const verificar = async () => {
                try {
                    setLoading(true);
                    const response = await searchIsJefeByCodDeptoAndRut(codDepto, rut);
                    setEsJefe(response.esJefe);
                } catch (err) {
                    setError(err);
                    setEsJefe(false);
                    console.error('Error al verificar si es jefe:', err);
                } finally {
                    setLoading(false);
                }
            };
            verificar();
        }
    }, [codDepto, rut]);

    return { esJefe, loading, error };
};