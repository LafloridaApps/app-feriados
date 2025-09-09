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
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="row align-items-end g-3">
          <div className="col-md-2">
            <label htmlFor="consultaFechaDesde" className="form-label">Fecha Desde</label>
            <input
              type="date"
              className="form-control"
              id="consultaFechaDesde"
              name="fechaDesde"
              value={filters.fechaDesde}
              onChange={onInputChange}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaFechaHasta" className="form-label">Fecha Hasta</label>
            <input
              type="date"
              className="form-control"
              id="consultaFechaHasta"
              name="fechaHasta"
              value={filters.fechaHasta}
              onChange={onInputChange}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaNombreFuncionario" className="form-label">Nombre Funcionario</label>
            <input
              type="text"
              className="form-control"
              id="consultaNombreFuncionario"
              name="nombreFuncionario"
              value={filters.nombreFuncionario}
              onChange={onInputChange}
              placeholder="Buscar por nombre..."
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaIdSolicitud" className="form-label">ID Solicitud</label>
            <input
              type="text"
              className="form-control"
              id="consultaIdSolicitud"
              name="idSolicitud" 
              value={filters.idSolicitud}
              onChange={onInputChange}
              placeholder="Buscar por ID..."
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaId" className="form-label">ID Decreto</label>
            <input
              type="text"
              className="form-control"
              id="consultaId"
              name="id"
              value={filters.id}
              onChange={onInputChange}
              placeholder="Buscar por ID..."
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="consultaRut" className="form-label">RUT Funcionario</label>
            <input
              type="text"
              className="form-control"
              id="consultaRut"
              name="rut"
              value={filters.rut}
              onChange={onInputChange}
              placeholder="Buscar por RUT..."
            />
          </div>
          <div className="col-md-2 d-flex">
            <button className="btn btn-primary w-100 me-2" onClick={handleSearch}>
              Buscar
            </button>
            <button className="btn btn-secondary w-100" onClick={handleClear}>
              Limpiar
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
