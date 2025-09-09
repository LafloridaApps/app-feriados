
import { useState } from 'react';
import { getDecretosBetweenDates } from '../services/buscardecreto';

export const useDecretoSearch = (setLoading, mostrarAlertaError) => {
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [results, setResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleSearch = async () => {
        if (!fechaDesde || !fechaHasta) {
            mostrarAlertaError('Debe seleccionar una fecha de inicio y una fecha de fin.');
            return;
        }

        setLoading(true);
        try {
            const fetchedDecretos = await getDecretosBetweenDates(fechaDesde, fechaHasta);
            setResults(fetchedDecretos);
            setSearchPerformed(true);
            return fetchedDecretos; // Return results to be used by other hooks if needed
        } catch (error) {
            mostrarAlertaError('Error al buscar decretos.', error.message || 'Ocurrió un error inesperado.');
            console.error('Error al buscar decretos:', error);
            setResults([]); // Clear results on error
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFechaDesde('');
        setFechaHasta('');
        setResults([]);
        setSearchPerformed(false);
    };

    return {
        fechaDesde,
        setFechaDesde,
        fechaHasta,
        setFechaHasta,
        results,
        setResults,
        searchPerformed,
        handleSearch,
        handleClear,
    };
};
