// src/hooks/useIsJefe.js
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { searchIsJefeByCodDeptoAndRut } from '../services/jefeService';

export function useIsJefe() {
    const verificar = useCallback(async (codDepto, rut) => {
        try {
            const response = await searchIsJefeByCodDeptoAndRut(codDepto, rut);
            return response.data;
        } catch (error) {
            console.error('Error al verificar si es jefe:', error);
            throw error;
        }
    }, []);

    return { verificar };
}
useIsJefe.propTypes = {
    codEx: PropTypes.string.isRequired,
    rut: PropTypes.string.isRequired,
};