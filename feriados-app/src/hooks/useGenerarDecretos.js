import { useState, useContext } from 'react';
import { useRrhhData } from './useRrhhData';
import { useRrhhSelection } from './useRrhhSelection';
import { getAprobacionesBetweenDates } from '../services/aprobacionListService';
import { decretar } from '../services/decretarService';
import { getDocDecreto } from '../services/docService.js';
import { listTemplates } from '../services/templateService';
import { useAlertaSweetAlert } from './useAlertaSweetAlert';
import { UsuarioContext } from '../context/UsuarioContext';
import { exportToExcel } from '../services/utils';

export const useGenerarDecretos = () => {
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [selectedTipoSolicitud, setSelectedTipoSolicitud] = useState('');
    const [selectedTipoContrato, setSelectedTipoContrato] = useState([]);
    const [searchRut, setSearchRut] = useState('');
    const [searchNombre, setSearchNombre] = useState('');
    const [searchIdSolicitud, setSearchIdSolicitud] = useState('');
    const [allAprobaciones, setAllAprobaciones] = useState([]);
    const [tipoSolicitudOptions, setTipoSolicitudOptions] = useState([]);
    const [tipoContratoOptions, setTipoContratoOptions] = useState([]);
    const [aprobacionesSearchPerformed, setAprobacionesSearchPerformed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const { mostrarAlertaError, mostrarAlertaExito } = useAlertaSweetAlert();
    const funcionario = useContext(UsuarioContext);

    const { currentAprobaciones, totalFilteredItems, paginate, nextPage, prevPage, currentPage, itemsPerPage } = useRrhhData(
        allAprobaciones, selectedTipoSolicitud, selectedTipoContrato, searchRut, searchNombre, searchIdSolicitud, sortConfig
    );
    const { selectedItems, setSelectedItems, handleSelectItem, handleSelectAll } = useRrhhSelection(currentAprobaciones);

    const handleCargarAprobaciones = async () => {
        if (!fechaDesde || !fechaHasta) {
            mostrarAlertaError('Debe seleccionar una fecha de inicio y una fecha de fin.');
            return;
        }
        setLoading(true);
        try {
            const response = await getAprobacionesBetweenDates(fechaDesde, fechaHasta);
            const data = Array.isArray(response) ? response : [];
            setAllAprobaciones(data);

            if (data.length > 0) {
                const uniqueSolicitudes = [...new Set(data.map(item => item.tipoSolicitud))];
                const uniqueContratos = [...new Set(data.map(item => item.tipoContrato))];
                setTipoSolicitudOptions(uniqueSolicitudes);
                setTipoContratoOptions(uniqueContratos);
            } else {
                setTipoSolicitudOptions([]);
                setTipoContratoOptions([]);
            }

            setSelectedItems([]);
            setAprobacionesSearchPerformed(true);
        } catch (error) {
            mostrarAlertaError('Error al cargar aprobaciones.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
        setSelectedTipoSolicitud('');
        setSelectedTipoContrato([]);
        setSearchRut('');
        setSearchNombre('');
        setSearchIdSolicitud('');
        setAllAprobaciones([]);
        setTipoSolicitudOptions([]);
        setTipoContratoOptions([]);
        setSelectedItems([]);
        setAprobacionesSearchPerformed(false);
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
        } finally {
            setLoading(false);
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
        if (!funcionario || !funcionario.rut) {
            mostrarAlertaError('No se pudo obtener el RUT del usuario para generar el decreto.');
            return;
        }

        setLoading(true);
        setShowTemplateModal(false);
        try {
            const decretos = {
                ids: selectedItems,
                rut: funcionario.rut,
                template: templateName
            };

            const response = await decretar(decretos);

            if (response && response.length > 0) {
                let excelSuccess = false;
                try {
                    await exportToExcel(response, 'decretos_generados');
                    excelSuccess = true;
                } catch (excelError) {
                    mostrarAlertaError('Error al exportar a Excel.', excelError.message || 'Ocurrió un error al exportar el archivo Excel.');
                    console.error('Error exporting to Excel:', excelError);
                }

                let wordSuccess = false;
                try {
                    const nroDecreto = response[0].nroDecreto;
                    if (!nroDecreto) {
                        throw new Error("No se encontró el 'nroDecreto' en la respuesta para generar el documento Word.");
                    }
                    const wordResponse = await getDocDecreto(nroDecreto);
                    const url = window.URL.createObjectURL(wordResponse.data);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `decreto_${nroDecreto}.docx`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                    wordSuccess = true;
                } catch (wordError) {
                    mostrarAlertaError('Error al descargar el documento Word.', wordError.message || 'Ocurrió un error inesperado.');
                    console.error('Error downloading Word document:', wordError);
                }

                if (excelSuccess && wordSuccess) {
                    mostrarAlertaExito('Generación Exitosa', 'Decretos generados. Archivos Excel y Word descargados.');
                } else if (excelSuccess) {
                    mostrarAlertaExito('Generación Parcial', 'Decretos generados y exportados a Excel, pero falló la descarga del Word.');
                } else if (wordSuccess) {
                    mostrarAlertaExito('Generación Parcial', 'El documento Word fue descargado, pero falló la exportación a Excel.');
                }

            } else {
                mostrarAlertaError('No se recibieron datos para generar los archivos o la generación no fue exitosa.');
            }
        } catch (error) {
            mostrarAlertaError('Error al generar el decreto.', error.message || 'Ocurrió un error inesperado.');
            console.error('Error al generar el decreto:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTipoContratoChange = (e) => {
        const { value, checked } = e.target;
        setSelectedTipoContrato(prev => checked ? [...prev, value] : prev.filter(type => type !== value));
    };

    return {
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        selectedTipoSolicitud, setSelectedTipoSolicitud,
        selectedTipoContrato, handleTipoContratoChange,
        searchRut, setSearchRut,
        searchNombre, setSearchNombre,
        searchIdSolicitud, setSearchIdSolicitud,
        allAprobaciones,
        tipoSolicitudOptions,
        tipoContratoOptions,
        aprobacionesSearchPerformed,
        loading, setLoading,
        showTemplateModal, setShowTemplateModal,
        templates,
        selectedTemplate, setSelectedTemplate,
        sortConfig,
        currentAprobaciones,
        totalFilteredItems,
        paginate,
        nextPage,
        prevPage,
        currentPage,
        itemsPerPage,
        selectedItems,
        handleSelectItem,
        handleSelectAll,
        handleCargarAprobaciones,
        requestSort,
        handleLimpiarFiltros,
        handleOpenTemplateModal,
        handleGenerarDecreto
    };
};