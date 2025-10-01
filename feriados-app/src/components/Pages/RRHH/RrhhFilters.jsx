import React from 'react';
import PropTypes from 'prop-types';

const RrhhFilters = ({
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    handleCargarAprobaciones,
    handleLimpiarFiltros,
    loading,
    selectedTipoContrato,
    handleTipoContratoChange,
    tipoContratoOptions,
    selectedTipoSolicitud,
    setSelectedTipoSolicitud,
    tipoSolicitudOptions,
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
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span className="visually-hidden">Cargando...</span>
                            </>
                        ) : (
                            'Cargar Aprobaciones'
                        )}
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

            {(tipoSolicitudOptions.length > 0 || tipoContratoOptions.length > 0) && (
                <>
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
                        {/* Tipo Contrato Filter */}
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
                </>
            )}
        </div>
    );
};

RrhhFilters.propTypes = {
    fechaDesde: PropTypes.string.isRequired,
    setFechaDesde: PropTypes.func.isRequired,
    fechaHasta: PropTypes.string.isRequired,
    setFechaHasta: PropTypes.func.isRequired,
    handleCargarAprobaciones: PropTypes.func.isRequired,
    handleLimpiarFiltros: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedTipoContrato: PropTypes.array.isRequired,
    handleTipoContratoChange: PropTypes.func.isRequired,
    tipoContratoOptions: PropTypes.array.isRequired,
    selectedTipoSolicitud: PropTypes.string.isRequired,
    setSelectedTipoSolicitud: PropTypes.func.isRequired,
    tipoSolicitudOptions: PropTypes.array.isRequired,
};

export default RrhhFilters;