import { useState, useEffect, useMemo } from 'react';

export const useBuscarDepartamento = ({ show, onClose, onSelected, departamentos }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepto, setSelectedDepto] = useState(null);

    // Flatten departments for easier searching
    const flatDepartamentos = useMemo(() => {
        const flatten = (nodes) => {
            let result = [];
            if (!Array.isArray(nodes)) return result;
            nodes.forEach(node => {
                result.push({ 
                    idDepto: node.id, 
                    nombreDepartamento: node.nombre 
                });
                if (node.dependencias && node.dependencias.length > 0) {
                    result = result.concat(flatten(node.dependencias));
                }
            });
            return result;
        };
        return flatten(departamentos);
    }, [departamentos]);

    // Filtered departments based on search term
    const filteredDepartamentos = useMemo(() => {
        if (!searchTerm.trim()) return flatDepartamentos;
        const lowerSearch = searchTerm.toLowerCase();
        return flatDepartamentos.filter(d => 
            d.nombreDepartamento.toLowerCase().includes(lowerSearch)
        );
    }, [flatDepartamentos, searchTerm]);

    useEffect(() => {
        if (!show) {
            setSearchTerm('');
            setSelectedDepto(null);
        }
    }, [show]);

    const handleConfirm = () => {
        if (selectedDepto) {
            onSelected(selectedDepto);
            onClose();
        }
    };

    return {
        searchTerm, setSearchTerm, selectedDepto, setSelectedDepto,
        filteredDepartamentos, handleConfirm,
    };
};
