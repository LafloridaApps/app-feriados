import { useState, useEffect, useMemo } from 'react';

export const useRrhhData = (initialData, selectedTipoSolicitud, selectedTipoContrato, searchRut, searchNombre) => {
    const [filteredAprobaciones, setFilteredAprobaciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items per page

    useEffect(() => {
        let tempFiltered = initialData;

        if (selectedTipoSolicitud) {
            tempFiltered = tempFiltered.filter(item => item.tipoSolicitud === selectedTipoSolicitud);
        }

        if (selectedTipoContrato.length > 0) {
            tempFiltered = tempFiltered.filter(item => selectedTipoContrato.includes(item.contrato));
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
                item.nombre.toLowerCase().includes(lowerCaseSearchNombre)
            );
        }

        setFilteredAprobaciones(tempFiltered);
        setCurrentPage(1);
    }, [initialData, selectedTipoSolicitud, selectedTipoContrato, searchRut, searchNombre]); // Add new dependencies

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
