import React, { useState } from 'react';
import { useRrhhData } from '../../../hooks/useRrhhData';
import { useRrhhSelection } from '../../../hooks/useRrhhSelection';


import GeneradorDecretos from './GeneradorDecretos';
import TablaDecretos from './TablaDecretos';
import RrhhPagination from './RrhhPagination';
import ConsultaDecretosFilters from './ConsultaDecretosFilters';
import ConsultaDecretosResults from './ConsultaDecretosResults';
import { getAprobacionesBetweenDates } from '../../../services/aprobacionListService';
import { decretar } from '../../../services/decretarService';
import { getDocDecreto } from '../../../services/docService.js';
import { listTemplates } from '../../../services/templateService';
import { useAlertaSweetAlert } from '../../../hooks/useAlertaSweetAlert';
import { useContext } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { exportToExcel } from '../../../services/utils';
import EliminarGeneracionDecretos from './EliminarGeneracionDecretos';
import { TemplateSelectionModal } from './TemplateSelectionModal';
import { searchDecretos } from '../../../services/consultaDecretoService';

const RRHHPage = () => {
    const [activeTab, setActiveTab] = useState('generar');

    // State for "Generar Decretos" Tab
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

    // State for "Consultar Decretos" Tab
    const [consultaFilters, setConsultaFilters] = useState({ id: '', fechaDesde: '', fechaHasta: '', rut: '', idSolicitud: '', nombreFuncionario: '' });
    const [consultaResults, setConsultaResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPageConsulta, setCurrentPageConsulta] = useState(0); // Pageable usa 0-based index
    const [itemsPerPageConsulta, setItemsPerPageConsulta] = useState(10);
    const [totalItemsConsulta, setTotalItemsConsulta] = useState(0);


    const { mostrarAlertaError, mostrarAlertaExito } = useAlertaSweetAlert();
    const funcionario = useContext(UsuarioContext);

    // Hook for pending approvals data
    const { currentAprobaciones, totalFilteredItems, paginate, nextPage, prevPage, currentPage, itemsPerPage } = useRrhhData(
        allAprobaciones, selectedTipoSolicitud, selectedTipoContrato, searchRut, searchNombre, searchIdSolicitud, sortConfig
    );
    const { selectedItems, setSelectedItems, handleSelectItem, handleSelectAll } = useRrhhSelection(currentAprobaciones);

    // --- Handlers for "Generar Decretos" ---
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

    // --- Handlers for "Consultar Decretos" ---
    const handleConsultaSearch = async (page = 0) => {
        setLoading(true);
        setSearchPerformed(false);
        try {
            const pageable = {
                page: page,
                size: itemsPerPageConsulta,
                sort: sortConfig.key ? `${sortConfig.key},${sortConfig.direction === 'ascending' ? 'asc' : 'desc'}` : ''
            };
            const response = await searchDecretos(consultaFilters, pageable);
            setConsultaResults(response.content);
            setTotalItemsConsulta(response.page.totalElements); // <-- Corrección aquí
            setCurrentPageConsulta(response.page.number); // <-- También corregir el número de página
            setSearchPerformed(true);
        } catch (error) {
            mostrarAlertaError('Error al buscar decretos.', error.message || 'Ocurrió un error inesperado.');
            console.error('Error al buscar decretos:', error);
            setConsultaResults([]);
            setTotalItemsConsulta(0);
        } finally {
            setLoading(false);
        }
    };

    const handleConsultaClear = () => {
        setConsultaFilters({ id: '', fechaDesde: '', fechaHasta: '', rut: '', idSolicitud: '', nombreFuncionario: '' });
        setConsultaResults([]);
        setSearchPerformed(false);
        setCurrentPageConsulta(0);
        setTotalItemsConsulta(0);
    };

    const paginateConsulta = (pageNumber) => setCurrentPageConsulta(pageNumber);
    const nextPageConsulta = () => setCurrentPageConsulta(prev => prev + 1);
    const prevPageConsulta = () => setCurrentPageConsulta(prev => prev - 1);

    // --- Static Options ---


    return (
        <div className="container-fluid">
            <h2 className="my-4">Gestión de Decretos RRHH</h2>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'generar' ? 'active' : ''}`} onClick={() => setActiveTab('generar')}>
                        Generar Decretos
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'consultar' ? 'active' : ''}`} onClick={() => setActiveTab('consultar')}>
                        Consultar Decretos Generados
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'eliminar' ? 'active' : ''}`} onClick={() => setActiveTab('eliminar')}>
                        Eliminar Decretos Generados
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'generar' && (
                    <div className="tab-pane fade show active">
                        <GeneradorDecretos
                            fechaDesde={fechaDesde} setFechaDesde={setFechaDesde}
                            fechaHasta={fechaHasta} setFechaHasta={setFechaHasta}
                            selectedTipoSolicitud={selectedTipoSolicitud} setSelectedTipoSolicitud={setSelectedTipoSolicitud}
                            selectedTipoContrato={selectedTipoContrato} handleTipoContratoChange={handleTipoContratoChange}
                            searchRut={searchRut} setSearchRut={setSearchRut}
                            searchNombre={searchNombre} setSearchNombre={setSearchNombre}
                            searchIdSolicitud={searchIdSolicitud} setSearchIdSolicitud={setSearchIdSolicitud}
                            handleCargarAprobaciones={handleCargarAprobaciones}
                            handleLimpiarFiltros={handleLimpiarFiltros}
                            tipoSolicitudOptions={tipoSolicitudOptions}
                            tipoContratoOptions={tipoContratoOptions}
                            selectedItemsCount={selectedItems.length}
                            handleGenerarDecreto={handleOpenTemplateModal}
                            allAprobaciones={allAprobaciones}
                            loading={loading}
                        />
                        {loading && (
                            <div className="d-flex justify-content-center mt-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                        {totalFilteredItems > 0 && (
                            <>
                                <TablaDecretos
                                    data={currentAprobaciones}
                                    selectedItems={selectedItems}
                                    onSelectItem={handleSelectItem}
                                    onSelectAll={handleSelectAll}
                                    requestSort={requestSort}
                                    sortConfig={sortConfig} />
                                <RrhhPagination
                                    itemsPerPage={itemsPerPage}
                                    totalItems={totalFilteredItems}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                    nextPage={nextPage}
                                    prevPage={prevPage} />
                            </>
                        )}
                        {aprobacionesSearchPerformed && totalFilteredItems === 0 && (
                            <div className="alert alert-info mt-4" role="alert">No se encontraron aprobaciones con los filtros aplicados.</div>
                        )}
                        {!aprobacionesSearchPerformed && (
                            <div className="alert alert-secondary mt-4" role="alert">Complete los filtros y haga clic en <strong>Cargar Aprobaciones</strong> para ver los resultados.</div>
                        )}
                    </div>
                )}

                {activeTab === 'consultar' && (
                    <div className="tab-pane fade show active">
                        <ConsultaDecretosFilters filters={consultaFilters} setFilters={setConsultaFilters} handleSearch={() => handleConsultaSearch(0)} handleClear={handleConsultaClear} />
                        {console.log('searchPerformed:', searchPerformed, 'totalItemsConsulta:', totalItemsConsulta)} 
                        {loading && (
                            <div className="d-flex justify-content-center mt-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                        {searchPerformed && totalItemsConsulta > 0 && (
                            <>
                                <ConsultaDecretosResults data={consultaResults} />
                                <RrhhPagination
                                    itemsPerPage={itemsPerPageConsulta}
                                    totalItems={totalItemsConsulta}
                                    paginate={paginateConsulta}
                                    currentPage={currentPageConsulta}
                                    nextPage={nextPageConsulta}
                                    prevPage={prevPageConsulta}
                                />
                            </>
                        )}
                        {searchPerformed && totalItemsConsulta === 0 && (
                            <div className="alert alert-info mt-4" role="alert">No se encontraron decretos con los filtros aplicados.</div>
                        )}
                        {!searchPerformed && (
                            <div className="alert alert-secondary mt-4" role="alert">Complete los filtros y haga clic en <strong>Buscar</strong> para ver los resultados.</div>
                        )}
                    </div>
                )}

                {activeTab === 'eliminar' && (
                    <div className="tab-pane fade show active">
                        <EliminarGeneracionDecretos setLoading={setLoading} />
                    </div>
                )}
            </div>
            <TemplateSelectionModal
                show={showTemplateModal}
                onHide={() => setShowTemplateModal(false)}
                templates={templates}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
                onConfirm={handleGenerarDecreto}
            />
        </div>
    );
};

export default RRHHPage;