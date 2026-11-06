import { useState, useCallback, useMemo } from 'react';
import { useRrhhSelection } from './useRrhhSelection';
import { getAprobacionesBetweenDates } from '../services/aprobacionListService';

const ITEMS_PER_PAGE = 10;

export const useAprobaciones = ({ setLoading, mostrarAlertaError }) => {
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [allAprobaciones, setAllAprobaciones] = useState([]);
    const [aprobacionesSearchPerformed, setAprobacionesSearchPerformed] = useState(false);

    // State for component pagination
    const [componentPage, setComponentPage] = useState(1);

    // State for filters
    const [selectedTipoContrato, setSelectedTipoContrato] = useState([]);
    const [tipoContratoOptions, setTipoContratoOptions] = useState([]);
    const [selectedTipoSolicitud, setSelectedTipoSolicitud] = useState('');
    const [tipoSolicitudOptions, setTipoSolicitudOptions] = useState([]);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });


    const handleCargarAprobaciones = useCallback(async () => {
        if (!fechaDesde || !fechaHasta) {
            mostrarAlertaError('Debe seleccionar una fecha de inicio y una fecha de fin.');
            return;
        }
        setLoading(true);
        setComponentPage(1); // Reset to first page for a new search

        try {
            // Call service without pagination parameters, as it fetches all data
            const response = await getAprobacionesBetweenDates(fechaDesde, fechaHasta);

            // Check if the response is a valid, non-empty array
            if (response && Array.isArray(response) && response.length > 0) {
                setAllAprobaciones(response); // Set the whole dataset

                // Update filter options from the data
                const uniqueContratos = [...new Set(response.map(item => item.tipoContrato))];
                setTipoContratoOptions(uniqueContratos);
                const uniqueSolicitudes = [...new Set(response.map(item => item.tipoSolicitud))];
                setTipoSolicitudOptions(uniqueSolicitudes);

            } else {
                // Clear previous results and show error if new search yields nothing.
                setAllAprobaciones([]);
                setTipoContratoOptions([]);
                setTipoSolicitudOptions([]);
                mostrarAlertaError('No se encontraron aprobaciones para los filtros seleccionados.');
            }
            setAprobacionesSearchPerformed(true);
        } catch (error) {
            mostrarAlertaError('Error al cargar aprobaciones.');
            console.error('Error al cargar aprobaciones:', error.response ? error.response.data : error);
            setAllAprobaciones([]); // Clear data on error
            setTipoContratoOptions([]);
            setTipoSolicitudOptions([]);
        } finally {
            setLoading(false);
        }
    }, [fechaDesde, fechaHasta, mostrarAlertaError, setLoading]);

    const handlePageChange = (newPage) => {
        setComponentPage(newPage);
    };

    const handleTipoContratoChange = (e) => {
        const { value, checked } = e.target;
        setSelectedTipoContrato(prev => checked ? [...prev, value] : prev.filter(type => type !== value));
        setComponentPage(1); // Reset to first page on filter change
    };

    // Apply client-side filtering before pagination
    const filteredAprobaciones = useMemo(() => {
        return allAprobaciones
            .filter(item => {
                return selectedTipoContrato.length === 0 || selectedTipoContrato.includes(item.tipoContrato);
            })
            .filter(item => {
                return selectedTipoSolicitud === '' || item.tipoSolicitud === selectedTipoSolicitud;
            });
    }, [allAprobaciones, selectedTipoContrato, selectedTipoSolicitud]);

    // Derived state for current page items, memoized to prevent infinite loops
    const currentAprobaciones = useMemo(() => filteredAprobaciones.slice(
        (componentPage - 1) * ITEMS_PER_PAGE,
        componentPage * ITEMS_PER_PAGE
    ), [filteredAprobaciones, componentPage]);

    const { selectedItems, setSelectedItems, handleSelectItem, handleSelectAll } = useRrhhSelection(filteredAprobaciones);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleLimpiarFiltros = () => {
        setFechaDesde('');
        setFechaHasta('');
        setAllAprobaciones([]);
        setSelectedItems([]);
        setAprobacionesSearchPerformed(false);
        // Reset pagination and filter state
        setComponentPage(1);
        setSelectedTipoContrato([]);
        setTipoContratoOptions([]);
        setSelectedTipoSolicitud('');
        setTipoSolicitudOptions([]);
    };

    return {
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        allAprobaciones, aprobacionesSearchPerformed,
        sortConfig, currentAprobaciones,
        selectedItemsCount: selectedItems.length,
        totalElements: filteredAprobaciones.length,
        componentPage, itemsPerPage: ITEMS_PER_PAGE,
        handlePageChange, selectedItems, handleSelectItem, handleSelectAll,
        handleCargarAprobaciones, requestSort, handleLimpiarFiltros,
        selectedTipoContrato, handleTipoContratoChange, tipoContratoOptions,
        selectedTipoSolicitud, setSelectedTipoSolicitud, tipoSolicitudOptions,
    };
};
