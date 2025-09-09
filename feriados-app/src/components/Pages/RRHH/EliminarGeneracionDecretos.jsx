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
        <div className="card shadow-sm mb-4">
            <div className="card-header">
                <h5>Eliminar Decretos Generados</h5>
            </div>
            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="fechaDesde" className="form-label">Fecha Desde</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fechaDesde"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="fechaHasta" className="form-label">Fecha Hasta</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fechaHasta"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                        <button className="btn btn-primary me-2" onClick={handleSearch}>Buscar</button>
                        <button className="btn btn-secondary" onClick={handleClear}>Limpiar</button>
                    </div>
                </div>

                {results.length > 0 && (
                    <div className="row mb-3">
                        <div className="col-12">
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteSelected}
                                disabled={selectedDecretos.length === 0}
                            >
                                Eliminar Seleccionados ({selectedDecretos.length})
                            </button>
                        </div>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="table-responsive mt-4">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedDecretos.length === results.length && results.length > 0}
                                            onChange={handleSelectAllDecretos}
                                        />
                                    </th>
                                    <th>Decreto</th>
                                    <th>Fecha Decreto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(decreto => (
                                    <tr key={decreto.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedDecretos.includes(decreto.id)}
                                                onChange={() => handleSelectDecreto(decreto.id)}
                                            />
                                        </td>
                                        <td>{decreto.id}</td>
                                        <td>{decreto.fechaDecreto}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {results.length === 0 && searchPerformed && (
                    <div className="alert alert-info mt-4" role="alert">No se encontraron decretos en el rango de fechas seleccionado.</div>
                )}
            </div>
        </div>
    );
};

export default EliminarGeneracionDecretos;
