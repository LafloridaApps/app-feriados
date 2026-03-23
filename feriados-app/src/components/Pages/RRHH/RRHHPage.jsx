import React, { useState } from 'react';
import { useGenerarDecretos } from '../../../hooks/useGenerarDecretos';
import { useConsultarDecretos } from '../../../hooks/useConsultarDecretos';
import { useAlertaSweetAlert } from '../../../hooks/useAlertaSweetAlert';

import GeneradorDecretos from './GeneradorDecretos';

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
        <div className="container-fluid rrhh-page-container pb-5">
            {/* Standardized Premium Header */}
            <div className="premium-header mb-4">
                <div className="d-flex align-items-center gap-3">
                    <div className="header-icon-hex">
                        <i className="bi bi-briefcase-fill"></i>
                    </div>
                    <div>
                        <h2 className="mb-0 fw-bold text-dark">Gestión de Decretos</h2>
                        <p className="text-muted mb-0">Portal Administrativo de Recursos Humanos</p>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <ul className="nav nav-tabs rrhh-tabs-nav shadow-sm">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'generar' ? 'active' : ''}`} onClick={() => setActiveTab('generar')}>
                            <i className="bi bi-plus-circle me-2"></i> Generar
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'consultar' ? 'active' : ''}`} onClick={() => setActiveTab('consultar')}>
                            <i className="bi bi-search me-2"></i> Consultar
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'eliminar' ? 'active' : ''}`} onClick={() => setActiveTab('eliminar')}>
                            <i className="bi bi-trash me-2"></i> Eliminar
                        </button>
                    </li>
                </ul>
            </div>

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
                            <div className="empty-state-premium">
                                <output className="spinner-border text-primary mb-3"></output>
                                <h4>Cargando Aprobaciones</h4>
                                <p>Por favor espere mientras procesamos la información...</p>
                            </div>
                        )}

                        {generarDecretos.aprobacionesSearchPerformed && generarDecretos.currentAprobaciones.length === 0 && !generarDecretos.loading && (
                            <div className="empty-state-premium">
                                <i className="bi bi-exclamation-circle text-info"></i>
                                <h4>Sin Resultados</h4>
                                <p>No se encontraron aprobaciones con los filtros aplicados.</p>
                            </div>
                        )}
                        {!generarDecretos.aprobacionesSearchPerformed && !generarDecretos.loading && (
                            <div className="empty-state-premium">
                                <i className="bi bi-funnel"></i>
                                <h4>Configuración de Filtros</h4>
                                <p>Complete los filtros y haga clic en <strong>Buscar Datos</strong> para visualizar las aprobaciones.</p>
                            </div>
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
                        {consultarDecretos.loading ? (
                            <div className="empty-state-premium">
                                <output className="spinner-border text-primary mb-3"></output>
                                <h4>Buscando Decretos</h4>
                                <p>Localizando registros en el servidor...</p>
                            </div>
                        ) : (
                            <>
                                {consultarDecretos.searchPerformed && consultarDecretos.totalItems > 0 && (
                                    <div className="mt-4">
                                        <ConsultaDecretosResults data={consultarDecretos.results} />
                                        <div className="mt-4">
                                            <RrhhPagination
                                                currentPage={consultarDecretos.currentPage + 1}
                                                totalPages={consultarDecretos.totalPages}
                                                onPageChange={consultarDecretos.handlePageChange}
                                            />
                                        </div>
                                    </div>
                                )}
                                {consultarDecretos.searchPerformed && consultarDecretos.totalItems === 0 && (
                                    <div className="empty-state-premium">
                                        <i className="bi bi-search text-warning"></i>
                                        <h4>Búsqueda sin resultados</h4>
                                        <p>No se encontraron decretos que coincidan con los criterios de búsqueda.</p>
                                    </div>
                                )}
                                {!consultarDecretos.searchPerformed && (
                                    <div className="empty-state-premium">
                                        <i className="bi bi-file-earmark-text"></i>
                                        <h4>Consulta de Historial</h4>
                                        <p>Utilice los filtros superiores para buscar decretos anteriormente generados.</p>
                                    </div>
                                )}
                            </>
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