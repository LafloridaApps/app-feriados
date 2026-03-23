import React from 'react';
import PropTypes from 'prop-types';
import RrhhFilters from './RrhhFilters';
import RrhhActions from './RrhhActions';
import TablaDecretos from './TablaDecretos'; // Asumiendo que la tabla se mostrará aquí
import RrhhPagination from './RrhhPagination'; // Asumiendo componente de paginación

const GeneradorDecretos = (props) => {
    const {
        // Filter props
        fechaDesde, setFechaDesde, fechaHasta, setFechaHasta,
        handleCargarAprobaciones, handleLimpiarFiltros,
        loading,

        // Action props
        selectedItemsCount, handleGenerarDecreto,

        // Data and table props
        currentAprobaciones, // Paginados para la tabla
        totalElements,
        selectedItems, onSelectItem, onSelectAll, requestSort, sortConfig,

        // Pagination props
        componentPage,
        itemsPerPage,
        handlePageChange,

        // Filter props
        selectedTipoContrato,
        handleTipoContratoChange,
        tipoContratoOptions,
        selectedTipoSolicitud,
        setSelectedTipoSolicitud,
        tipoSolicitudOptions,
    } = props;

    const totalPages = Math.ceil(totalElements / itemsPerPage);

    return (
        <div className="container-fluid py-4 generador-decretos-container">
            {/* Standardized Page Header - Premium Style */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-1 text-primary fw-bold">
                        <i className="bi bi-file-earmark-medical me-2"></i>{' '}
                        Generador de Decretos
                    </h2>
                    <p className="text-muted mb-0">
                        Procesa las aprobaciones y genera los documentos oficiales
                    </p>
                </div>
            </div>

            <div className="accordion accordion-premium mb-5" id="accordionGeneradorDecretos">
                {/* Step 1: Filters */}
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFiltros">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFiltros" aria-expanded="true" aria-controls="collapseFiltros">
                            <span className="step-indicator">1</span> Búsqueda y Filtros de Datos
                        </button>
                    </h2>
                    <div id="collapseFiltros" className="accordion-collapse collapse show" aria-labelledby="headingFiltros" data-bs-parent="#accordionGeneradorDecretos">
                        <div className="accordion-body px-4 pb-4">
                            <RrhhFilters
                                fechaDesde={fechaDesde}
                                setFechaDesde={setFechaDesde}
                                fechaHasta={fechaHasta}
                                setFechaHasta={setFechaHasta}
                                handleCargarAprobaciones={() => handleCargarAprobaciones(0)} // Carga inicial
                                handleLimpiarFiltros={handleLimpiarFiltros}
                                loading={loading}
                                selectedTipoContrato={selectedTipoContrato}
                                handleTipoContratoChange={handleTipoContratoChange}
                                tipoContratoOptions={tipoContratoOptions}
                                selectedTipoSolicitud={selectedTipoSolicitud}
                                setSelectedTipoSolicitud={setSelectedTipoSolicitud}
                                tipoSolicitudOptions={tipoSolicitudOptions}
                            />
                        </div>
                    </div>
                </div>

                {/* Step 2: Actions */}
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingAcciones">
                        <button
                            className={`accordion-button ${currentAprobaciones.length === 0 ? 'collapsed' : ''}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseAcciones"
                            aria-expanded={currentAprobaciones.length > 0}
                            aria-controls="collapseAcciones"
                            disabled={currentAprobaciones.length === 0}
                        >
                            <span className="step-indicator">2</span> Acciones Masivas
                        </button>
                    </h2>
                    <div
                        id="collapseAcciones"
                        className={`accordion-collapse collapse ${currentAprobaciones.length > 0 ? 'show' : ''}`}
                        aria-labelledby="headingAcciones"
                        data-bs-parent="#accordionGeneradorDecretos"
                    >
                        <div className="accordion-body px-4 pb-4">
                            <RrhhActions
                                selectedItemsCount={selectedItemsCount}
                                handleGenerarDecreto={handleGenerarDecreto}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {currentAprobaciones.length > 0 && (
                <div className="bg-white p-4 rounded shadow-sm border">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <i className="bi bi-table text-primary fs-4"></i>
                        <h4 className="mb-0 fw-bold">Resultados de la Búsqueda</h4>
                        <span className="badge bg-light text-dark border ms-2">
                            {totalElements} registros encontrados
                        </span>
                    </div>
                    
                    <TablaDecretos
                        data={currentAprobaciones}
                        selectedItems={selectedItems}
                        onSelectItem={onSelectItem}
                        onSelectAll={onSelectAll}
                        requestSort={requestSort}
                        sortConfig={sortConfig}
                    />

                    <div className="mt-4 pt-4 border-top">
                        <RrhhPagination
                            currentPage={componentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

GeneradorDecretos.propTypes = {
    fechaDesde: PropTypes.string.isRequired,
    setFechaDesde: PropTypes.func.isRequired,
    fechaHasta: PropTypes.string.isRequired,
    setFechaHasta: PropTypes.func.isRequired,
    handleCargarAprobaciones: PropTypes.func.isRequired,
    handleLimpiarFiltros: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedItemsCount: PropTypes.number.isRequired,
    handleGenerarDecreto: PropTypes.func.isRequired,
    currentAprobaciones: PropTypes.array.isRequired,
    totalElements: PropTypes.number.isRequired,
    selectedItems: PropTypes.array.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    requestSort: PropTypes.func.isRequired,
    sortConfig: PropTypes.object.isRequired,
    componentPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    selectedTipoContrato: PropTypes.array.isRequired,
    handleTipoContratoChange: PropTypes.func.isRequired,
    tipoContratoOptions: PropTypes.array.isRequired,
    selectedTipoSolicitud: PropTypes.string.isRequired,
    setSelectedTipoSolicitud: PropTypes.func.isRequired,
    tipoSolicitudOptions: PropTypes.array.isRequired,
};

export default GeneradorDecretos;
