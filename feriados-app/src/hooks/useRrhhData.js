import { useState, useEffect, useMemo } from 'react';

export const useRrhhData = (initialData, selectedTipoSolicitud, selectedTipoContrato, searchRut, searchNombre, searchIdSolicitud, sortConfig) => {
    const [filteredAprobaciones, setFilteredAprobaciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items per page

    useEffect(() => {
        let tempFiltered = initialData || [];

        if (selectedTipoSolicitud) {
            tempFiltered = tempFiltered.filter(item => item.tipoSolicitud === selectedTipoSolicitud);
        }

        if (selectedTipoContrato.length > 0) {
            tempFiltered = tempFiltered.filter(item => selectedTipoContrato.includes(item.tipoContrato));
        }

        if (searchRut) {
            const lowerCaseSearchRut = searchRut.toLowerCase();
            tempFiltered = tempFiltered.filter(item =>
                item.rut.toLowerCase().includes(lowerCaseSearchRut)
            );
        }

        if (searchNombre) {
            const lowerCaseSearchNombre = searchNombre.toLowerCase();
            tempFiltered = tempFiltered.filter(item =>
                item.nombres.toLowerCase().includes(lowerCaseSearchNombre)
            );
        }

        if (searchIdSolicitud) {
            tempFiltered = tempFiltered.filter(item =>
                String(item.idSolicitud).includes(searchIdSolicitud)
            );
        }

        let sortedData = [...tempFiltered];
        if (sortConfig.key) {
            const dateKeys = new Set(['desde', 'hasta', 'fechaSolicitud']);
            const parseDate = (dateString) => {
                if (!dateString) return new Date(0);
                const parts = dateString.split('-');
                return new Date(parts[2], parts[1] - 1, parts[0]);
            };

            sortedData.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];

                // Handle null/undefined values
                if (valA == null) return 1;
                if (valB == null) return -1;

                let parsedA = valA;
                let parsedB = valB;

                if (dateKeys.has(sortConfig.key)) {
                    parsedA = parseDate(valA).getTime();
                    parsedB = parseDate(valB).getTime();
                }

                if (parsedA === parsedB) return 0;

                const comparison = parsedA < parsedB ? -1 : 1;
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }

        setFilteredAprobaciones(sortedData);
        setCurrentPage(1);
    }, [initialData, selectedTipoSolicitud, selectedTipoContrato, searchRut, searchNombre, searchIdSolicitud, sortConfig]); // Add new dependencies

    const currentAprobaciones = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredAprobaciones.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredAprobaciones, currentPage, itemsPerPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => prev + 1);
    const prevPage = () => setCurrentPage(prev => prev - 1);

    return {
        filteredAprobaciones,
        currentAprobaciones,
        currentPage,
        itemsPerPage,
        totalFilteredItems: filteredAprobaciones.length,
        paginate,
        nextPage,
        prevPage,
    };
};
