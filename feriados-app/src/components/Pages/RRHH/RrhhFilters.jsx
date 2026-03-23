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
        <div className="rrhh-filters">
            <div className="row g-3 align-items-end">
                {/* Date Range Filters */}
                <div className="col-md-3">
                    <label htmlFor="fechaDesde" className="form-label-premium">
                        <i className="bi bi-calendar-range me-2"></i>Fecha Desde
                    </label>
                    <input
                        type="date"
                        className="form-control form-control-premium"
                        id="fechaDesde"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label htmlFor="fechaHasta" className="form-label-premium">
                        <i className="bi bi-calendar-range me-2"></i>Fecha Hasta
                    </label>
                    <input
                        type="date"
                        className="form-control form-control-premium"
                        id="fechaHasta"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-premium w-100"
                        onClick={handleCargarAprobaciones}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Cargando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-search me-2"></i>Buscar Datos
                            </>
                        )}
                    </button>
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-outline-secondary w-100 py-2"
                        style={{ borderRadius: '10px', fontWeight: '600' }}
                        onClick={handleLimpiarFiltros}
                    >
                        <i className="bi bi-eraser me-2"></i>Limpiar
                    </button>
                </div>
            </div>

            {(tipoSolicitudOptions.length > 0 || tipoContratoOptions.length > 0) && (
                <div className="mt-4 pt-4 border-top">
                    <div className="row g-4">
                        {/* Tipo Solicitud Filter */}
                        <div className="col-md-6">
                            <label htmlFor="tipoSolicitud" className="form-label-premium">
                                <i className="bi bi-funnel me-2"></i>Tipo de Solicitud
                            </label>
                            <select
                                className="form-select form-select-premium"
                                id="tipoSolicitud"
                                value={selectedTipoSolicitud}
                                onChange={(e) => setSelectedTipoSolicitud(e.target.value)}
                            >
                                <option value="">Todos los tipos</option>
                                {tipoSolicitudOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        {/* Tipo Contrato Filter */}
                        <div className="col-md-6">
                            <span className="form-label-premium d-block mb-2">
                                <i className="bi bi-file-earmark-person me-2"></i>Tipo de Contrato
                            </span>
                            <div className="d-flex flex-wrap gap-3 p-2 bg-light rounded shadow-inner">
                                {tipoContratoOptions.map(option => (
                                    <div className="form-check custom-checkbox" key={option}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`contrato-${option}`}
                                            value={option}
                                            checked={selectedTipoContrato.includes(option)}
                                            onChange={handleTipoContratoChange}
                                        />
                                        <label className="form-check-label fw-500" htmlFor={`contrato-${option}`}>
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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