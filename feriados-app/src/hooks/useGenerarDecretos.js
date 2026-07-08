import { useState, useContext, useCallback, useMemo } from 'react';
import { useRrhhSelection } from './useRrhhSelection';
import { getAprobacionesBetweenDates } from '../services/aprobacionListService';
import { decretar } from '../services/decretarService';
import { getDocDecreto, getExcelDecreto } from '../services/docService.js';
import { listTemplates } from '../services/templateService';
import { useAlertaSweetAlert } from './useAlertaSweetAlert';
import { UsuarioContext } from '../context/UsuarioContext';

const ITEMS_PER_PAGE = 10;
const BACKEND_PAGE_SIZE = 20;

export const useGenerarDecretos = () => {
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [allAprobaciones, setAllAprobaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aprobacionesSearchPerformed, setAprobacionesSearchPerformed] = useState(false);

    // State for component pagination 
    const [componentPage, setComponentPage] = useState(1);

    // State for filters
    const [selectedTipoContrato, setSelectedTipoContrato] = useState([]);
    const [tipoContratoOptions, setTipoContratoOptions] = useState([]);
    const [selectedTipoSolicitud, setSelectedTipoSolicitud] = useState('');
    const [tipoSolicitudOptions, setTipoSolicitudOptions] = useState([]);

    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const { mostrarAlertaError, mostrarAlertaExito } = useAlertaSweetAlert();
    const funcionario = useContext(UsuarioContext);

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
    }, [fechaDesde, fechaHasta, mostrarAlertaError]);

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

    const handleOpenTemplateModal = async () => {
        if (selectedItems.length === 0) {
            mostrarAlertaError('Debe seleccionar al menos una aprobación.');
            return;
        }
        try {
            setLoading(true);
            const templateList = await listTemplates();
            setTemplates(templateList);
            if (templateList.length > 0) {
                setSelectedTemplate(templateList[0].nombre);
            }
            setShowTemplateModal(true);
        } catch (error) {
            mostrarAlertaError('Error al cargar las plantillas.', error.message);
            console.error('Error al cargar las plantillas:', error.response ? error.response.data : error);
        } finally {
            setLoading(false);
        }
    };

    const procesarWord = async (nroDecreto) => {
        try {
            if (!nroDecreto) {
                throw new Error("No se encontró el 'nroDecreto' en la respuesta.");
            }
            console.log('[procesarWord] Descargando Word para nroDecreto:', nroDecreto);
            const wordResponse = await getDocDecreto(nroDecreto);
            const url = globalThis.URL.createObjectURL(wordResponse.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `decreto_${nroDecreto}.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            globalThis.URL.revokeObjectURL(url);
            console.log('[procesarWord] Word descargado exitosamente');
            return true;
        } catch (wordError) {
            console.error('[procesarWord] Error:', wordError.response?.data || wordError.message);
            mostrarAlertaError('Error al descargar el documento Word.', wordError.message || 'Ocurrió un error inesperado.');
            return false;
        }
    };

    const procesarExcelBackend = async (nroDecreto) => {
        try {
            if (!nroDecreto) {
                throw new Error("No se encontró el 'nroDecreto' en la respuesta.");
            }
            console.log('[procesarExcelBackend] Descargando Excel para nroDecreto:', nroDecreto);
            const excelResponse = await getExcelDecreto(nroDecreto);
            const url = globalThis.URL.createObjectURL(excelResponse.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `solicitudes-${nroDecreto}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            globalThis.URL.revokeObjectURL(url);
            console.log('[procesarExcelBackend] Excel descargado exitosamente');
            return true;
        } catch (excelError) {
            console.error('[procesarExcelBackend] Error:', excelError.response?.data || excelError.message);
            mostrarAlertaError('Error al descargar el Excel.', excelError.message || 'Ocurrió un error inesperado.');
            return false;
        }
    };

    const handleGenerarDecreto = async (templateName) => {
        if (!templateName) {
            mostrarAlertaError('Debe seleccionar una plantilla.');
            return;
        }
        if (selectedItems.length === 0) {
            mostrarAlertaError('Debe seleccionar al menos una aprobación para generar un decreto.');
            return;
        }
        if (!funcionario?.rut) {
            mostrarAlertaError('No se pudo obtener el RUT del usuario para generar el decreto.');
            return;
        }

        setLoading(true);
        setShowTemplateModal(false);
        try {
            const templateObj = templates.find(t => t.nombre === templateName);
            if (!templateObj) {
                mostrarAlertaError('La plantilla seleccionada no es válida.');
                setLoading(false);
                return;
            }

            const payload = {
                ids: selectedItems,
                rut: funcionario.rut,
                template: templateObj.docFile
            };

            console.log('[handleGenerarDecreto] Enviando payload:', JSON.stringify(payload));
            const response = await decretar(payload);

            const solicitudes = response?.solicitudes;
            const nroDecreto = solicitudes?.[0]?.nroDecreto;

            if (solicitudes && solicitudes.length > 0 && nroDecreto) {
                console.log('[handleGenerarDecreto] Decreto generado exitosamente. nroDecreto:', nroDecreto);
                console.log('[handleGenerarDecreto] rutaWord:', response.rutaWord);
                console.log('[handleGenerarDecreto] rutaExcel:', response.rutaExcel);

                const wordSuccess = await procesarWord(nroDecreto);
                const excelSuccess = await procesarExcelBackend(nroDecreto);

                if (wordSuccess && excelSuccess) {
                    mostrarAlertaExito('Generación Exitosa', 'Decretos generados. Archivos Word y Excel descargados.');
                } else if (wordSuccess) {
                    mostrarAlertaExito('Generación Parcial', 'Word descargado, pero falló la descarga del Excel.');
                } else if (excelSuccess) {
                    mostrarAlertaExito('Generación Parcial', 'Excel descargado, pero falló la descarga del Word.');
                } else {
                    mostrarAlertaError('Error al descargar los archivos. Los decretos se generaron en el servidor.');
                }
            } else {
                console.error('[handleGenerarDecreto] Respuesta inesperada:', JSON.stringify(response));
                mostrarAlertaError('No se recibieron datos válidos del servidor.');
            }
        } catch (error) {
            const errorData = error.response?.data;
            console.error('[handleGenerarDecreto] Error completo:', {
                status: error.response?.status,
                data: errorData,
                message: error.message
            });
            const mensaje = errorData?.mensaje || error.message || 'Error desconocido';
            mostrarAlertaError('Error al generar el decreto', mensaje);
        } finally {
            setLoading(false);
        }
    };

    return {
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        allAprobaciones,
        aprobacionesSearchPerformed,
        loading, setLoading,
        showTemplateModal, setShowTemplateModal,
        templates,
        selectedTemplate, setSelectedTemplate,
        sortConfig,
        currentAprobaciones, // The items for the current view, filtered and paginated
        totalElements: filteredAprobaciones.length, // Total items after filtering for pagination
        componentPage, // Current page for pagination component
        itemsPerPage: ITEMS_PER_PAGE,
        handlePageChange, // Function to change page
        selectedItems,
        handleSelectItem,
        handleSelectAll,
        handleCargarAprobaciones,
        requestSort,
        handleLimpiarFiltros,
        handleOpenTemplateModal,
        handleGenerarDecreto,
        // Contract filter props
        selectedTipoContrato,
        handleTipoContratoChange,
        tipoContratoOptions,
        // Solicitud filter props
        selectedTipoSolicitud,
        setSelectedTipoSolicitud,
        tipoSolicitudOptions,
    };
};