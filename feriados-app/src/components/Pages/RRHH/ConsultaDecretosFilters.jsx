import React from 'react';
import PropTypes from 'prop-types';

const ConsultaDecretosFilters = ({
  filters,
  setFilters,
  handleSearch,
  handleClear,
}) => {
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card border-0 shadow-sm mb-4 rounded-16 overflow-hidden">
      <div className="card-header bg-white py-3 border-bottom bordr-light">
        <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
          <i className="bi bi-funnel me-2 text-primary"></i> Filtros de Búsqueda
        </h5>
      </div>
      <div className="card-body p-4">
        <div className="row g-4 align-items-end">
          <div className="col-md-2">
            <label htmlFor="consultaFechaDesde" className="form-label-premium">
              <i className="bi bi-calendar me-2"></i>Fecha Desde
            </label>
            <input
              type="date"
              className="form-control form-control-premium"
              id="consultaFechaDesde"
              name="fechaDesde"
              value={filters.fechaDesde}
              onChange={onInputChange}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaFechaHasta" className="form-label-premium">
              <i className="bi bi-calendar me-2"></i>Fecha Hasta
            </label>
            <input
              type="date"
              className="form-control form-control-premium"
              id="consultaFechaHasta"
              name="fechaHasta"
              value={filters.fechaHasta}
              onChange={onInputChange}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaNombreFuncionario" className="form-label-premium">
              <i className="bi bi-person me-2"></i>Funcionario
            </label>
            <input
              type="text"
              className="form-control form-control-premium"
              id="consultaNombreFuncionario"
              name="nombreFuncionario"
              value={filters.nombreFuncionario}
              onChange={onInputChange}
              placeholder="Nombre..."
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaIdSolicitud" className="form-label-premium">
              <i className="bi bi-hash me-2"></i>Solicitud
            </label>
            <input
              type="text"
              className="form-control form-control-premium"
              id="consultaIdSolicitud"
              name="idSolicitud" 
              value={filters.idSolicitud}
              onChange={onInputChange}
              placeholder="ID..."
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaId" className="form-label-premium">
              <i className="bi bi-file-earmark-text me-2"></i>Decreto
            </label>
            <input
              type="text"
              className="form-control form-control-premium"
              id="consultaId"
              name="id"
              value={filters.id}
              onChange={onInputChange}
              placeholder="ID..."
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaRut" className="form-label-premium">
              <i className="bi bi-card-text me-2"></i>RUT
            </label>
            <input
              type="text"
              className="form-control form-control-premium"
              id="consultaRut"
              name="rut"
              value={filters.rut}
              onChange={onInputChange}
              placeholder="RUT..."
            />
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 mt-4">
            <button className="btn btn-outline-secondary px-4 py-2" onClick={handleClear} style={{ borderRadius: '10px', fontWeight: '600' }}>
              <i className="bi bi-eraser me-2"></i>Limpiar
            </button>
            <button className="btn btn-premium px-5 py-2" onClick={handleSearch}>
              <i className="bi bi-search me-2"></i>Buscar Decretos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConsultaDecretosFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
};

export default ConsultaDecretosFilters;
