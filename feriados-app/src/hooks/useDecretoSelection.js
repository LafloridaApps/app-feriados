import { useState, useEffect } from 'react';
import { eliminarDecretos } from '../services/eliminarDecretos';

export const useDecretoSelection = (initialResults, setLoading, mostrarAlertaError, mostrarAlertaExito, confirmarAccion, onDeletionSuccess) => {
    const [selectedDecretos, setSelectedDecretos] = useState([]);
    const [results, setResults] = useState(initialResults);

    useEffect(() => {
        setResults(initialResults);
        setSelectedDecretos([]); // Clear selection when results change
    }, [initialResults]);

    const handleSelectDecreto = (decretoId) => {
        setSelectedDecretos(prevSelected => {
            if (prevSelected.includes(decretoId)) {
                return prevSelected.filter(id => id !== decretoId);
            } else {
                return [...prevSelected, decretoId];
            }
        });
    };

    const handleSelectAllDecretos = () => {
        if (selectedDecretos.length === results.length) {
            setSelectedDecretos([]);
        } else {
            setSelectedDecretos(results.map(decreto => decreto.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedDecretos.length === 0) {
            mostrarAlertaError('Debe seleccionar al menos un decreto para eliminar.');
            return;
        }

        const confirm = await confirmarAccion(
            'Confirmar Eliminación',
            `¿Está seguro de que desea eliminar ${selectedDecretos.length} decreto(s) seleccionado(s)? Esta acción no se puede deshacer.`
        );

        if (!confirm) {
            return;
        }

        setLoading(true);
        try {
            const response = await eliminarDecretos(selectedDecretos);
            mostrarAlertaExito(response.message, `${selectedDecretos.length} decreto(s) eliminado(s) correctamente.`);
            setSelectedDecretos([]); // Clear selection
            if (onDeletionSuccess) {
                onDeletionSuccess(); // Callback to refresh data
            }
        } catch (error) {
            mostrarAlertaError('Error al eliminar decretos.', error.message || 'Ocurrió un error inesperado.');
            console.error('Error al eliminar decretos:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        selectedDecretos,
        handleSelectDecreto,
        handleSelectAllDecretos,
        handleDeleteSelected,
        results,
        setResults
    };
};
