import { useState } from 'react';
import { useAlertaSweetAlert } from './useAlertaSweetAlert';
import { useAprobaciones } from './useAprobaciones';
import { useGeneracionDecretos } from './useGeneracionDecretos';

export const useGenerarDecretos = () => {
    const [loading, setLoading] = useState(false);
    const { mostrarAlertaError } = useAlertaSweetAlert();
    const aprobaciones = useAprobaciones({ setLoading, mostrarAlertaError });
    const generacion = useGeneracionDecretos({
        selectedItems: aprobaciones.selectedItems,
        handleLimpiarFiltros: aprobaciones.handleLimpiarFiltros,
        setLoading,
        mostrarAlertaError,
    });

    return {
        ...aprobaciones,
        ...generacion,
        loading,
        setLoading,
    };
};
