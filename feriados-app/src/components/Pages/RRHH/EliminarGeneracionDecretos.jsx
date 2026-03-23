import React from 'react';
import PropTypes from 'prop-types';
import { useAlertaSweetAlert } from '../../../hooks/useAlertaSweetAlert';
import { useDecretoSearch } from '../../../hooks/useDecretoSearch';
import { useDecretoSelection } from '../../../hooks/useDecretoSelection';

const EliminarGeneracionDecretos = ({ setLoading }) => {
    const { mostrarAlertaError, mostrarAlertaExito, confirmarAccion } = useAlertaSweetAlert();

    const {
        fechaDesde,
        setFechaDesde,
        fechaHasta,
        setFechaHasta,
        results: searchResults,
        searchPerformed,
        handleSearch,
        handleClear,
    } = useDecretoSearch(setLoading, mostrarAlertaError);

    const {
        selectedDecretos,
        handleSelectDecreto,
        handleSelectAllDecretos,
        handleDeleteSelected,
        results,
    } = useDecretoSelection(
        searchResults,
        setLoading,
        mostrarAlertaError,
        mostrarAlertaExito,
        confirmarAccion,
        handleSearch // Callback to refresh data on successful deletion
    );

    return (
        <div className="card border-0 shadow-sm mb-4 rounded-16 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom border-light">
                <h5 className="mb-0 fw-bold text-danger d-flex align-items-center">
                    <i className="bi bi-trash-fill me-2"></i> Eliminar Decretos Generados
                </h5>
            </div>
            <div className="card-body p-4">
                <div className="row g-4 align-items-end mb-4">
                    <div className="col-md-4">
                        <label htmlFor="fechaDesde" className="form-label-premium">
                            <i className="bi bi-calendar me-2"></i>Fecha Desde
                        </label>
                        <input
                            type="date"
                            className="form-control form-control-premium"
                            id="fechaDesde"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="fechaHasta" className="form-label-premium">
                            <i className="bi bi-calendar me-2"></i>Fecha Hasta
                        </label>
                        <input
                            type="date"
                            className="form-control form-control-premium"
                            id="fechaHasta"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 d-flex gap-2">
                        <button className="btn btn-outline-secondary px-4 py-2 flex-grow-1" onClick={handleClear} style={{ borderRadius: '10px', fontWeight: '600' }}>
                            <i className="bi bi-eraser me-2"></i>Limpiar
                        </button>
                        <button className="btn btn-premium px-4 py-2 flex-grow-1" onClick={handleSearch}>
                            <i className="bi bi-search me-2"></i>Buscar
                        </button>
                    </div>
                </div>

                {results.length > 0 && (
                    <div className="mb-4 d-flex justify-content-between align-items-center bg-light p-3 rounded-12">
                        <div className="d-flex align-items-center text-muted small">
                            <i className="bi bi-info-circle me-2"></i>{' '}
                            Selecciona los decretos que deseas revertir permanentemente.
                        </div>
                        <button
                            className="btn btn-danger px-4"
                            onClick={handleDeleteSelected}
                            disabled={selectedDecretos.length === 0}
                            style={{ borderRadius: '10px' }}
                        >
                            <i className="bi bi-trash-fill me-2"></i>
                            Eliminar Seleccionados ({selectedDecretos.length})
                        </button>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="table-responsive">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th className="px-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedDecretos.length === results.length && results.length > 0}
                                            onChange={handleSelectAllDecretos}
                                        />
                                    </th>
                                    <th>Nro. Decreto</th>
                                    <th>Fecha de Generación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(decreto => (
                                    <tr key={decreto.id}>
                                        <td className="px-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={selectedDecretos.includes(decreto.id)}
                                                onChange={() => handleSelectDecreto(decreto.id)}
                                            />
                                        </td>
                                        <td className="fw-bold">#{decreto.id}</td>
                                        <td className="text-muted">{decreto.fechaDecreto}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {results.length === 0 && searchPerformed && (
                    <div className="empty-state-premium">
                        <i className="bi bi-search text-info"></i>
                        <h4>Sin decretos encontrados</h4>
                        <p>No se registraron decretos en el periodo seleccionado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

EliminarGeneracionDecretos.propTypes = {
    setLoading: PropTypes.func.isRequired,
};

export default EliminarGeneracionDecretos;
