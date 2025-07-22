// src/hooks/useFuncionario.js
import { useCallback } from 'react';
import { getFuncionarioByRutAndVrut } from '../services/funcionarioService';

export function useFuncionario() {
    const consultarRut = useCallback(async (rut, vRut) => {
        try {
            const response = await getFuncionarioByRutAndVrut(rut, vRut);
            return response;
        } catch (error) {
            console.error('Error al consultar funcionario:', error);
            throw error;
        }
    }, []);

    return { consultarRut };
}

