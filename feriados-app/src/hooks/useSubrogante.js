import { useCallback } from 'react';
import { subroganciaService } from '../services/subroganciaService';

export function useSubrogante() {
    const consultarRut = useCallback(async (rut, fechaInicio, fechaFin) => {
        try {
            const response = await subroganciaService.buscarPorRut(rut, fechaInicio, fechaFin);
            return response;
        } catch (error) {
            console.error('Error al consultar funcionario:', error);
            throw error;
        }
    }, []);

    return { consultarRut };
}



