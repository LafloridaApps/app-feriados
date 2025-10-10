import React, { useState } from 'react';
import { useGenerarDecretos } from '../../../hooks/useGenerarDecretos';
import { useConsultarDecretos } from '../../../hooks/useConsultarDecretos';
import { useAlertaSweetAlert } from '../../../hooks/useAlertaSweetAlert';

import GeneradorDecretos from './GeneradorDecretos';
import TablaDecretos from './TablaDecretos';
import RrhhPagination from './RrhhPagination';
import ConsultaDecretosFilters from './ConsultaDecretosFilters';
import ConsultaDecretosResults from './ConsultaDecretosResults';
import EliminarGeneracionDecretos from './EliminarGeneracionDecretos';
import { TemplateSelectionModal } from './TemplateSelectionModal';
import './RRHHPage.css'; // Importar el archivo CSS personalizado

const RRHHPage = () => {
    const [activeTab, setActiveTab] = useState('generar');
    const { mostrarAlertaError } = useAlertaSweetAlert();

    const generarDecretos = useGenerarDecretos();
    const consultarDecretos = useConsultarDecretos(mostrarAlertaError);

    return (
        <div className="container-fluid rrhh-page-container">
            <h2 className="my-4 rrhh-page-header">Gestión de Decretos RRHH</h2>

            <ul className="nav nav-tabs mb-3 rrhh-tabs-nav">
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

            <div className="tab-content rrhh-tab-content-card">
                {activeTab === 'generar' && (
                    <div className="tab-pane fade show active">
                        <GeneradorDecretos
                            // Props del hook directamente
                            fechaDesde={generarDecretos.fechaDesde}
                            setFechaDesde={generarDecretos.setFechaDesde}
                            fechaHasta={generarDecretos.fechaHasta}
                            setFechaHasta={generarDecretos.setFechaHasta}
                            handleCargarAprobaciones={generarDecretos.handleCargarAprobaciones}
                            handleLimpiarFiltros={generarDecretos.handleLimpiarFiltros}
                            loading={generarDecretos.loading}
                            selectedItemsCount={generarDecretos.selectedItems.length}
                            handleGenerarDecreto={generarDecretos.handleOpenTemplateModal}
                            currentAprobaciones={generarDecretos.currentAprobaciones}
                            totalElements={generarDecretos.totalElements}
                            selectedItems={generarDecretos.selectedItems}
                            onSelectItem={generarDecretos.handleSelectItem}
                            onSelectAll={generarDecretos.handleSelectAll}
                            requestSort={generarDecretos.requestSort}
                            sortConfig={generarDecretos.sortConfig}
                            componentPage={generarDecretos.componentPage}
                            itemsPerPage={generarDecretos.itemsPerPage}
                            handlePageChange={generarDecretos.handlePageChange}
                            selectedTipoContrato={generarDecretos.selectedTipoContrato}
                            handleTipoContratoChange={generarDecretos.handleTipoContratoChange}
                            tipoContratoOptions={generarDecretos.tipoContratoOptions}
                            selectedTipoSolicitud={generarDecretos.selectedTipoSolicitud}
                            setSelectedTipoSolicitud={generarDecretos.setSelectedTipoSolicitud}
                            tipoSolicitudOptions={generarDecretos.tipoSolicitudOptions}
                        />

                        {generarDecretos.loading && (
                            <div className="d-flex justify-content-center mt-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}

                        {generarDecretos.aprobacionesSearchPerformed && generarDecretos.currentAprobaciones.length === 0 && !generarDecretos.loading && (
                            <div className="alert alert-info mt-4" role="alert">No se encontraron aprobaciones con los filtros aplicados.</div>
                        )}
                        {!generarDecretos.aprobacionesSearchPerformed && (
                            <div className="alert alert-secondary mt-4" role="alert">Complete los filtros y haga clic en <strong>Cargar Aprobaciones</strong> para ver los resultados.</div>
                        )}
                    </div>
                )}

                {activeTab === 'consultar' && (
                    <div className="tab-pane fade show active">
                        <ConsultaDecretosFilters 
                            filters={consultarDecretos.filters} 
                            setFilters={consultarDecretos.setFilters} 
                            handleSearch={() => consultarDecretos.handleSearch(0)} 
                            handleClear={consultarDecretos.handleClear} />
                        {consultarDecretos.loading && (
                            <div className="d-flex justify-content-center mt-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                        {consultarDecretos.searchPerformed && consultarDecretos.totalItems > 0 && (
                            <>
                                <ConsultaDecretosResults data={consultarDecretos.results} />
                                <RrhhPagination
                                    currentPage={consultarDecretos.currentPage + 1}
                                    totalPages={consultarDecretos.totalPages}
                                    onPageChange={consultarDecretos.handlePageChange}
                                />
                            </>
                        )}
                        {consultarDecretos.searchPerformed && consultarDecretos.totalItems === 0 && (
                            <div className="alert alert-info mt-4" role="alert">No se encontraron decretos con los filtros aplicados.</div>
                        )}
                        {!consultarDecretos.searchPerformed && (
                            <div className="alert alert-secondary mt-4" role="alert">Complete los filtros y haga clic en <strong>Buscar</strong> para ver los resultados.</div>
                        )}
                    </div>
                )}

                {activeTab === 'eliminar' && (
                    <div className="tab-pane fade show active">
                        <EliminarGeneracionDecretos setLoading={generarDecretos.setLoading} />
                    </div>
                )}
            </div>
            <TemplateSelectionModal
                show={generarDecretos.showTemplateModal}
                onHide={() => generarDecretos.setShowTemplateModal(false)}
                templates={generarDecretos.templates}
                selectedTemplate={generarDecretos.selectedTemplate}
                onTemplateChange={generarDecretos.setSelectedTemplate}
                onConfirm={generarDecretos.handleGenerarDecreto}
            />
        </div>
    );
};

export default RRHHPage;