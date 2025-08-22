import React from 'react';
import PropTypes from 'prop-types';
import RrhhFilters from './RrhhFilters';
import RrhhActions from './RrhhActions';

const GeneradorDecretos = (props) => {
    const {
        // Filter props
        fechaDesde, setFechaDesde, fechaHasta, setFechaHasta,
        selectedTipoSolicitud, setSelectedTipoSolicitud,
        selectedTipoContrato, handleTipoContratoChange,
        searchRut, setSearchRut, searchNombre, setSearchNombre,
        handleCargarAprobaciones, handleLimpiarFiltros,
        tipoSolicitudOptions, tipoContratoOptions,

        // Action props
        selectedItemsCount, handleExportToExcel, handleGenerarDecreto,

        // Data state
        allAprobaciones
    } = props;

    return (
        <div className="accordion shadow-sm mb-4" id="accordionGeneradorDecretos">
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingFiltros">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFiltros" aria-expanded="true" aria-controls="collapseFiltros">
                        Paso 1: Filtros y Carga de Datos
                    </button>
                </h2>
                <div id="collapseFiltros" className="accordion-collapse collapse show" aria-labelledby="headingFiltros" data-bs-parent="#accordionGeneradorDecretos">
                    <div className="accordion-body">
                        <RrhhFilters
                            fechaDesde={fechaDesde}
                            setFechaDesde={setFechaDesde}
                            fechaHasta={fechaHasta}
                            setFechaHasta={setFechaHasta}
                            selectedTipoSolicitud={selectedTipoSolicitud}
                            setSelectedTipoSolicitud={setSelectedTipoSolicitud}
                            selectedTipoContrato={selectedTipoContrato}
                            handleTipoContratoChange={handleTipoContratoChange}
                            searchRut={searchRut}
                            setSearchRut={setSearchRut}
                            searchNombre={searchNombre}
                            setSearchNombre={setSearchNombre}
                            handleCargarAprobaciones={handleCargarAprobaciones}
                            handleLimpiarFiltros={handleLimpiarFiltros}
                            tipoSolicitudOptions={tipoSolicitudOptions}
                            tipoContratoOptions={tipoContratoOptions}
                        />
                    </div>
                </div>
            </div>
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingAcciones">
                    <button
                        className={`accordion-button ${allAprobaciones.length === 0 ? 'collapsed' : ''}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseAcciones"
                        aria-expanded={allAprobaciones.length > 0}
                        aria-controls="collapseAcciones"
                        disabled={allAprobaciones.length === 0}
                    >
                        Paso 2: Acciones sobre Seleccionados
                    </button>
                </h2>
                <div
                    id="collapseAcciones"
                    className={`accordion-collapse collapse ${allAprobaciones.length > 0 ? 'show' : ''}`}
                    aria-labelledby="headingAcciones"
                    data-bs-parent="#accordionGeneradorDecretos"
                >
                    <div className="accordion-body">
                        <RrhhActions
                            selectedItemsCount={selectedItemsCount}
                            handleExportToExcel={handleExportToExcel}
                            handleGenerarDecreto={handleGenerarDecreto}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

GeneradorDecretos.propTypes = {
    fechaDesde: PropTypes.string.isRequired,
    setFechaDesde: PropTypes.func.isRequired,
    fechaHasta: PropTypes.string.isRequired,
    setFechaHasta: PropTypes.func.isRequired,
    selectedTipoSolicitud: PropTypes.string.isRequired,
    setSelectedTipoSolicitud: PropTypes.func.isRequired,
    selectedTipoContrato: PropTypes.array.isRequired,
    handleTipoContratoChange: PropTypes.func.isRequired,
    searchRut: PropTypes.string,
    setSearchRut: PropTypes.func,
    searchNombre: PropTypes.string,
    setSearchNombre: PropTypes.func,
    handleCargarAprobaciones: PropTypes.func.isRequired,
    handleLimpiarFiltros: PropTypes.func.isRequired,
    tipoSolicitudOptions: PropTypes.array.isRequired,
    tipoContratoOptions: PropTypes.array.isRequired,
    selectedItemsCount: PropTypes.number.isRequired,
    handleExportToExcel: PropTypes.func.isRequired,
    handleGenerarDecreto: PropTypes.func.isRequired,
    allAprobaciones: PropTypes.array.isRequired,
};

export default GeneradorDecretos;
