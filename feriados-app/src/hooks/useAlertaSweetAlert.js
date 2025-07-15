import { useCallback } from 'react';
import Swal from 'sweetalert2';

export const useAlertaSweetAlert = () => {
    const mostrarAlertaError = useCallback((mensaje) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje,
        });
    }, []);

    const mostrarAlertaExito = useCallback((titulo, html) => {
        Swal.fire({
            icon: 'success',
            title: titulo,
            html: html,
            confirmButtonText: 'OK'
        });
    }, []);

    const confirmarAccion = useCallback(async (titulo, texto) => {
        const result = await Swal.fire({
            icon: 'question',
            title: titulo,
            text: texto,
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
        });
        return result.isConfirmed;
    }, []);

    return { mostrarAlertaError, mostrarAlertaExito, confirmarAccion };
};