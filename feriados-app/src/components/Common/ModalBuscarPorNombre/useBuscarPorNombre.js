import { useState, useEffect, useCallback } from 'react';
import { buscarFuncionariosPorNombre } from '../../../services/funcionarioService';

export const useBuscarPorNombre = ({ show, onClose, onSelected, buscarFuncionarios = buscarFuncionariosPorNombre }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [funcionarios, setFuncionarios] = useState([]);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    // Paginación
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        if (!show) {
            setSearchTerm('');
            setFuncionarios([]);
            setSelectedFuncionario(null);
            setError('');
            setSearched(false);
            setCurrentPage(0);
            setTotalPages(0);
            setTotalItems(0);
        }
    }, [show]);

    const fetchPage = useCallback(async (pattern, pageNumber) => {
        setSearching(true);
        setError('');
        try {
            const data = await buscarFuncionarios(pattern, pageNumber);
            setFuncionarios(data.funcionarios || []);
            setCurrentPage(data.currentPage ?? pageNumber);
            setTotalPages(data.totalPages ?? 0);
            setTotalItems(data.totalItems ?? 0);
            setSelectedFuncionario(null);
            setSearched(true);
        } catch (err) {
            console.error('Error al buscar:', err);
            setError(err.response?.data?.message || 'Ocurrió un error al realizar la búsqueda. Intente nuevamente.');
        } finally {
            setSearching(false);
        }
    }, [buscarFuncionarios]);

    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        void fetchPage(searchTerm, 0);
    };

    const handlePageChange = (newPage) => {
        void fetchPage(searchTerm, newPage);
    };

    const handleSelectFuncionario = (func) => {
        setSelectedFuncionario(func);
        setError('');
    };

    const handleConfirm = () => {
        if (selectedFuncionario) {
            onSelected(selectedFuncionario);
            onClose();
        } else {
            setError('Por favor, seleccione un funcionario de la lista.');
        }
    };

    return {
        searchTerm,
        setSearchTerm,
        funcionarios,
        selectedFuncionario,
        searching,
        error,
        searched,
        currentPage,
        totalPages,
        totalItems,
        handleSearch,
        handlePageChange,
        handleSelectFuncionario,
        handleConfirm
    };
};
