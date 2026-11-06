import { useAlertaSweetAlert } from '../../../../hooks/useAlertaSweetAlert';
import { useDecretoSearch } from '../../../../hooks/useDecretoSearch';
import { useDecretoSelection } from '../../../../hooks/useDecretoSelection';

export const useEliminarGeneracionDecretos = (setLoading) => {
    const { mostrarAlertaError, mostrarAlertaExito, confirmarAccion } = useAlertaSweetAlert();

    const {
        fechaDesde,
        setFechaDesde,
        fechaHasta,
        setFechaHasta,
        results: searchResults,
        searchPerformed,
        handleSearch,
        handleClear,
    } = useDecretoSearch(setLoading, mostrarAlertaError);

    const {
        selectedDecretos,
        handleSelectDecreto,
        handleSelectAllDecretos,
        handleDeleteSelected,
        results,
    } = useDecretoSelection(
        searchResults,
        setLoading,
        mostrarAlertaError,
        mostrarAlertaExito,
        confirmarAccion,
        handleSearch // Callback to refresh data on successful deletion
    );

    return {
        fechaDesde, setFechaDesde, fechaHasta, setFechaHasta,
        searchPerformed, handleSearch, handleClear,
        selectedDecretos, handleSelectDecreto, handleSelectAllDecretos,
        handleDeleteSelected, results,
    };
};
