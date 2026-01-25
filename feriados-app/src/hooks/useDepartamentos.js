import { useState, useEffect, useCallback } from 'react';
import { getDepartamentosList } from '../services/departamentosService';

const useDepartamentos = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDepartamentos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getDepartamentosList();
            if (Array.isArray(response.data)) {
                setDepartamentos(response.data);
            } else {
                setError("La respuesta no tiene el formato esperado.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDepartamentos();
    }, [fetchDepartamentos]);

    const filterTree = (nodes, term) => {
        if (!term) return nodes;
        const lowerCaseTerm = term.toLowerCase();
        function filter(node) {
            const children = (node.dependencias || []).map(filter).filter(Boolean);
            if (node.nombre.toLowerCase().includes(lowerCaseTerm) || children.length > 0) {
                return { ...node, dependencias: children };
            }
            return null;
        }
        return nodes.map(filter).filter(Boolean);
    };

    const departamentosFiltrados = filterTree(departamentos, searchTerm);

    return {
        departamentos,
        departamentosFiltrados,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        fetchDepartamentos
    };
};

export default useDepartamentos;
