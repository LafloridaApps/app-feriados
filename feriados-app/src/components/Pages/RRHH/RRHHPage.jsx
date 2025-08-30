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
import { useAlertaSweetAlert } from '../../../hooks/useAlertaSweetAlert';
import { useContext } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { exportToExcel } from '../../../services/utils';
import EliminarGeneracionDecretos from './EliminarGeneracionDecretos';

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

    // State for "Consultar Decretos" Tab
    const [consultaFilters, setConsultaFilters] = useState({ nombre: '', idAprobacion: '', idDecreto: '', fechaDesde: '', fechaHasta: '' });
    const [consultaResults, setConsultaResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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

    const handleExportToExcel = () => { /* ... existing logic ... */ };
    const handleGenerarDecreto = async () => {
        if (selectedItems.length === 0) {
            mostrarAlertaError('Debe seleccionar al menos una aprobación para generar un decreto.');
            return;
        }

        if (!funcionario || !funcionario.rut) {
            mostrarAlertaError('No se pudo obtener el RUT del usuario para generar el decreto.');
            return;
        }

        setLoading(true);
        try {
            const decretos = {
                ids: selectedItems,
                rut: funcionario.rut
            }

            const response = await decretar(decretos);

            if (response && response.length > 0) {
                try {
                    await exportToExcel(response, 'decretos_generados');
                    mostrarAlertaExito('Generación de Decreto', 'Decretos generados con éxito y exportados a Excel.');
                } catch (excelError) {
                    mostrarAlertaError('Error al exportar a Excel.', excelError.message || 'Ocurrió un error al exportar el archivo Excel.');
                    console.error('Error exporting to Excel:', excelError);
                }
            } else {
                mostrarAlertaError('No se recibieron datos para generar el Excel o la generación no fue exitosa.');
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
    const handleConsultaSearch = () => {
        const { nombre, idAprobacion, idDecreto, fechaDesde, fechaHasta } = consultaFilters;
        let results = [];

        if (fechaDesde && fechaHasta) {
            results = results.filter(decreto => {
                const itemDate = new Date(decreto.fechaDecreto.split('-').reverse().join('-'));
                const from = new Date(fechaDesde);
                const to = new Date(fechaHasta);
                return itemDate >= from && itemDate <= to;
            });
        }

        results = results.filter(decreto => {
            return (
                (nombre ? decreto.nombre.toLowerCase().includes(nombre.toLowerCase()) : true) &&
                (idAprobacion ? decreto.id.toString() === idAprobacion : true) &&
                (idDecreto ? decreto.decretoId.toLowerCase().includes(idDecreto.toLowerCase()) : true)
            );
        });

        setConsultaResults(results);
        setSearchPerformed(true);
    };

    const handleConsultaClear = () => {
        setConsultaFilters({ nombre: '', idAprobacion: '', idDecreto: '', fechaDesde: '', fechaHasta: '' });
        setConsultaResults([]);
        setSearchPerformed(false);
    };

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
                            handleExportToExcel={handleExportToExcel}
                            handleGenerarDecreto={handleGenerarDecreto}
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
                        <ConsultaDecretosFilters filters={consultaFilters} setFilters={setConsultaFilters} handleSearch={handleConsultaSearch} handleClear={handleConsultaClear} />
                        {searchPerformed && <ConsultaDecretosResults data={consultaResults} />}
                    </div>
                )}

                {activeTab === 'eliminar' && (
                    <div className="tab-pane fade show active">
                        <EliminarGeneracionDecretos setLoading={setLoading} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RRHHPage;