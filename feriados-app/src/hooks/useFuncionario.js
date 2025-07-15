// src/hooks/useFuncionario.js
import { useCallback } from 'react';
import { getFuncionarioLocalByRut } from '../services/funcionarioService';

export function useFuncionario() {
    const consultarRut = useCallback(async (rut) => {
        try {
            const response = await getFuncionarioLocalByRut(rut);
            return response;
        } catch (error) {
            console.error('Error al consultar funcionario:', error);
            throw error;
        }
    }, []);

    return { consultarRut };
}

