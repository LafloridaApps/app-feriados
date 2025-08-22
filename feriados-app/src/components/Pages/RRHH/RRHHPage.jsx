import React, { useState } from 'react';
import { useRrhhData } from '../../../hooks/useRrhhData';
import { useRrhhSelection } from '../../../hooks/useRrhhSelection';
import { mockData } from './mockDecretos';
import { mockDecretosGenerados } from './mockDecretosGenerados';

import GeneradorDecretos from './GeneradorDecretos';
import TablaDecretos from './TablaDecretos';
import RrhhPagination from './RrhhPagination';
import ConsultaDecretosFilters from './ConsultaDecretosFilters';
import ConsultaDecretosResults from './ConsultaDecretosResults';

const RRHHPage = () => {
    const [activeTab, setActiveTab] = useState('generar');

    // State for "Generar Decretos" Tab
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [selectedTipoSolicitud, setSelectedTipoSolicitud] = useState('');
    const [selectedTipoContrato, setSelectedTipoContrato] = useState([]);
    const [searchRut, setSearchRut] = useState('');
    const [searchNombre, setSearchNombre] = useState('');
    const [allAprobaciones, setAllAprobaciones] = useState([]);

    // State for "Consultar Decretos" Tab
    const [consultaFilters, setConsultaFilters] = useState({ nombre: '', idAprobacion: '', idDecreto: '', fechaDesde: '', fechaHasta: '' });
    const [consultaResults, setConsultaResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);


    // Hook for pending approvals data
    const { currentAprobaciones, totalFilteredItems, paginate, nextPage, prevPage, currentPage, itemsPerPage } = useRrhhData(
        allAprobaciones, selectedTipoSolicitud, selectedTipoContrato, searchRut, searchNombre
    );
    const { selectedItems, setSelectedItems, handleSelectItem, handleSelectAll } = useRrhhSelection(currentAprobaciones);

    // --- Handlers for "Generar Decretos" ---
    const handleCargarAprobaciones = () => {
        let dataToFilter = mockData;
        if (fechaDesde && fechaHasta) {
            dataToFilter = mockData.filter(item => {
                const itemDate = new Date(item.fechaSolicitud.split('-').reverse().join('-'));
                const from = new Date(fechaDesde);
                const to = new Date(fechaHasta);
                return itemDate >= from && itemDate <= to;
            });
        }
        setAllAprobaciones(dataToFilter);
        setSelectedItems([]);
    };

    const handleLimpiarFiltros = () => {
        setFechaDesde('');
        setFechaHasta('');
        setSelectedTipoSolicitud('');
        setSelectedTipoContrato([]);
        setSearchRut('');
        setSearchNombre('');
        setAllAprobaciones([]);
        setSelectedItems([]);
    };

    const handleExportToExcel = () => { /* ... existing logic ... */ };
    const handleGenerarDecreto = () => { /* ... existing logic ... */ };
    const handleTipoContratoChange = (e) => {
        const { value, checked } = e.target;
        setSelectedTipoContrato(prev => checked ? [...prev, value] : prev.filter(type => type !== value));
    };

    // --- Handlers for "Consultar Decretos" ---
    const handleConsultaSearch = () => {
        const { nombre, idAprobacion, idDecreto, fechaDesde, fechaHasta } = consultaFilters;
        let results = mockDecretosGenerados;

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
    const tipoSolicitudOptions = ['Feriado Legal', 'Permiso Administrativo'];
    const tipoContratoOptions = ['Planta', 'Contrata', 'Suplencia', 'Honorarios'];

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
                            handleCargarAprobaciones={handleCargarAprobaciones}
                            handleLimpiarFiltros={handleLimpiarFiltros}
                            tipoSolicitudOptions={tipoSolicitudOptions}
                            tipoContratoOptions={tipoContratoOptions}
                            selectedItemsCount={selectedItems.length}
                            handleExportToExcel={handleExportToExcel}
                            handleGenerarDecreto={handleGenerarDecreto}
                            allAprobaciones={allAprobaciones}
                        />
                        {allAprobaciones.length > 0 && totalFilteredItems > 0 && (
                            <>
                                <TablaDecretos data={currentAprobaciones} selectedItems={selectedItems} onSelectItem={handleSelectItem} onSelectAll={handleSelectAll} />
                                <RrhhPagination itemsPerPage={itemsPerPage} totalItems={totalFilteredItems} paginate={paginate} currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} />
                            </>
                        )}
                        {allAprobaciones.length > 0 && totalFilteredItems === 0 && (
                            <div className="alert alert-info mt-4" role="alert">No se encontraron resultados con los filtros aplicados.</div>
                        )}
                        {allAprobaciones.length === 0 && (
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
            </div>
        </div>
    );
};

export default RRHHPage;