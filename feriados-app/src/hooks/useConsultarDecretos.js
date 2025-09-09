import { useState } from 'react';
import { searchDecretos } from '../services/consultaDecretoService';

export const useConsultarDecretos = (mostrarAlertaError) => {
    const [filters, setFilters] = useState({ id: '', fechaDesde: '', fechaHasta: '', rut: '', idSolicitud: '', nombreFuncionario: '' });
    const [results, setResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (page = 0) => {
        setLoading(true);
        setSearchPerformed(false);
        try {
            const pageable = {
                page: page,
                size: itemsPerPage,
                sort: sortConfig.key ? `${sortConfig.key},${sortConfig.direction === 'ascending' ? 'asc' : 'desc'}` : ''
            };
            const response = await searchDecretos(filters, pageable);
            setResults(response.content);
            setTotalItems(response.page.totalElements);
            setCurrentPage(response.page.number);
            setSearchPerformed(true);
        } catch (error) {
            mostrarAlertaError('Error al buscar decretos.', error.message || 'Ocurrió un error inesperado.');
            console.error('Error al buscar decretos:', error);
            setResults([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFilters({ id: '', fechaDesde: '', fechaHasta: '', rut: '', idSolicitud: '', nombreFuncionario: '' });
        setResults([]);
        setSearchPerformed(false);
        setCurrentPage(0);
        setTotalItems(0);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => prev + 1);
    const prevPage = () => setCurrentPage(prev => prev - 1);

    return {
        filters,
        setFilters,
        results,
        searchPerformed,
        sortConfig,
        setSortConfig,
        currentPage,
        itemsPerPage,
        totalItems,
        loading,
        handleSearch,
        handleClear,
        paginate,
        nextPage,
        prevPage
    };
};