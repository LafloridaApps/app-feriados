import React from 'react';
import PropTypes from 'prop-types';

const RrhhFilters = ({
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    selectedTipoSolicitud,
    setSelectedTipoSolicitud,
    selectedTipoContrato,
    handleTipoContratoChange,
    searchRut,
    setSearchRut,
    searchNombre,
    setSearchNombre,
    handleCargarAprobaciones,
    handleLimpiarFiltros,
    tipoSolicitudOptions,
    tipoContratoOptions,
}) => {
    return (
        <div>
            <div className="row align-items-end">
                {/* Date Range Filters */}
                <div className="col-md-3 mb-3">
                    <label htmlFor="fechaDesde" className="form-label">Fecha Desde</label>
                    <input
                        type="date"
                        className="form-control"
                        id="fechaDesde"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                </div>
                <div className="col-md-3 mb-3">
                    <label htmlFor="fechaHasta" className="form-label">Fecha Hasta</label>
                    <input
                        type="date"
                        className="form-control"
                        id="fechaHasta"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                </div>
                <div className="col-md-3 mb-3">
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleCargarAprobaciones}
                    >
                        Cargar Aprobaciones
                    </button>
                </div>
                <div className="col-md-3 mb-3">
                    <button
                        className="btn btn-secondary w-100"
                        onClick={handleLimpiarFiltros}
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            <hr className="my-4" />

            <div className="row">
                {/* Tipo Solicitud Filter */}
                <div className="col-md-6 mb-3">
                    <label htmlFor="tipoSolicitud" className="form-label">Tipo de Solicitud</label>
                    <select
                        className="form-select"
                        id="tipoSolicitud"
                        value={selectedTipoSolicitud}
                        onChange={(e) => setSelectedTipoSolicitud(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {tipoSolicitudOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                {/* Tipo Contrato Filter (Multi-select) */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">Tipo de Contrato</label>
                    <div>
                        {tipoContratoOptions.map(option => (
                            <div className="form-check form-check-inline" key={option}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`contrato-${option}`}
                                    value={option}
                                    checked={selectedTipoContrato.includes(option)}
                                    onChange={handleTipoContratoChange}
                                />
                                <label className="form-check-label" htmlFor={`contrato-${option}`}>
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="my-4" />

            {/* Collapsible Search Filters */}
            <p>
                <button
                    className="btn btn-link"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseSearchFilters"
                    aria-expanded="false"
                    aria-controls="collapseSearchFilters"
                >
                    Filtros de Búsqueda Adicionales <i className="bi bi-chevron-down"></i>
                </button>
            </p>
            <div className="collapse" id="collapseSearchFilters">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="searchRut" className="form-label">Buscar por Rut</label>
                        <input
                            type="text"
                            className="form-control"
                            id="searchRut"
                            value={searchRut}
                            onChange={(e) => setSearchRut(e.target.value)}
                            placeholder="Ej: 12.345.678-9"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="searchNombre" className="form-label">Buscar por Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="searchNombre"
                            value={searchNombre}
                            onChange={(e) => setSearchNombre(e.target.value)}
                            placeholder="Ej: Juan Perez"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

RrhhFilters.propTypes = {
    fechaDesde: PropTypes.string.isRequired,
    setFechaDesde: PropTypes.func.isRequired,
    fechaHasta: PropTypes.string.isRequired,
    setFechaHasta: PropTypes.func.isRequired,
    selectedTipoSolicitud: PropTypes.string.isRequired,
    setSelectedTipoSolicitud: PropTypes.func.isRequired,
    selectedTipoContrato: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleTipoContratoChange: PropTypes.func.isRequired,
    searchRut: PropTypes.string.isRequired,
    setSearchRut: PropTypes.func.isRequired,
    searchNombre: PropTypes.string.isRequired,
    setSearchNombre: PropTypes.func.isRequired,
    handleCargarAprobaciones: PropTypes.func.isRequired,
    handleLimpiarFiltros: PropTypes.func.isRequired,
    tipoSolicitudOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    tipoContratoOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RrhhFilters;