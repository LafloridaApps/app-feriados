import { useState, useEffect } from 'react';
import { searchDecretos } from '../services/consultaDecretoService';

export const useConsultarDecretos = (mostrarAlertaError) => {
    const [filters, setFilters] = useState({ id: '', fechaDesde: '', fechaHasta: '', rut: '', idSolicitud: '', nombreFuncionario: '' });
    const [allResults, setAllResults] = useState([]);
    const [results, setResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // The 'results' state will directly reflect the 'content' from the backend response
        // after handleSearch updates allResults.
        setResults(allResults);

    }, [allResults]); // Only re-run when allResults (content from backend) changes

    const handleSearch = async (pageNumber = 0) => {


        setLoading(true);
        setSearchPerformed(false);
        try {
            const response = await searchDecretos(filters, pageNumber, itemsPerPage);

            setAllResults(response?.content || []);
            setTotalItems(response?.page?.totalElements || 0);
            setTotalPages(response?.page?.totalPages || 0);
            setCurrentPage(response?.page?.number || 0); // Update currentPage from backend response
            setSearchPerformed(true);
        } catch (error) {
            mostrarAlertaError('Error al buscar decretos.', error.message || 'Ocurrió un error inesperado.');
            console.error('Error al buscar decretos:', error);
            setAllResults([]);
            setTotalItems(0);
            setTotalPages(0);
            setCurrentPage(0);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFilters({ id: '', fechaDesde: '', fechaHasta: '', rut: '', idSolicitud: '', nombreFuncionario: '' });
        setAllResults([]);
        setSearchPerformed(false);
        setCurrentPage(0);
        setTotalItems(0);
        setTotalPages(0);
    };

    const handlePageChange = (pageNumber) => {
        handleSearch(pageNumber - 1); // Backend pages are 0-indexed
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return {
        filters,
        setFilters,
        results,
        searchPerformed,
        sortConfig,
        requestSort, // Exportar para que la tabla lo use
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        loading,
        handleSearch,
        handleClear,
        handlePageChange
    };
};
