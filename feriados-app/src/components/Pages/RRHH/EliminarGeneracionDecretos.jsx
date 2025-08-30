import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAlertaSweetAlert } from '../../../hooks/useAlertaSweetAlert';
import { getDecretosBetweenDates } from '../../../services/buscardecreto';
import { eliminarDecretos } from '../../../services/eliminarDecretos';

const EliminarGeneracionDecretos = ({ setLoading }) => {
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [results, setResults] = useState([]);
    const [selectedDecretos, setSelectedDecretos] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const { mostrarAlertaError, mostrarAlertaExito, confirmarAccion } = useAlertaSweetAlert();

    const handleSearch = async () => {
        if (!fechaDesde || !fechaHasta) {
            mostrarAlertaError('Debe seleccionar una fecha de inicio y una fecha de fin.');
            return;
        }

        setLoading(true);
        try {
            const fetchedDecretos = await getDecretosBetweenDates(fechaDesde, fechaHasta);
            setResults(fetchedDecretos);
            setSelectedDecretos([]); // Clear selection on new search
            setSearchPerformed(true);
        } catch (error) {
            mostrarAlertaError('Error al buscar decretos.', error.message || 'Ocurrió un error inesperado.');
            console.error('Error al buscar decretos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFechaDesde('');
        setFechaHasta('');
        setResults([]);
        setSelectedDecretos([]);
        setSearchPerformed(false);
    };

    const handleSelectDecreto = (decretoId) => {
        setSelectedDecretos(prevSelected => {
            if (prevSelected.includes(decretoId)) {
                return prevSelected.filter(id => id !== decretoId);
            } else {
                return [...prevSelected, decretoId];
            }
        });
    };

    const handleSelectAllDecretos = () => {
        if (selectedDecretos.length === results.length) {
            setSelectedDecretos([]);
        } else {
            setSelectedDecretos(results.map(decreto => decreto.id));
        }
    };

    // New handleDeleteSelected function
    const handleDeleteSelected = async () => {
        if (selectedDecretos.length === 0) {
            mostrarAlertaError('Debe seleccionar al menos un decreto para eliminar.');
            return;
        }

        const confirm = await confirmarAccion(
            'Confirmar Eliminación',
            `¿Está seguro de que desea eliminar ${selectedDecretos.length} decreto(s) seleccionado(s)? Esta acción no se puede deshacer.`
        );

        if (!confirm) {
            return;
        }

        setLoading(true);
        try {


            const response = await eliminarDecretos(selectedDecretos);
            mostrarAlertaExito(response.message, `${selectedDecretos.length} decreto(s) simuladamente eliminado(s) correctamente.`);
            setSelectedDecretos([]); // Clear selection
            handleSearch(); // Reload the table
        } catch (error) {
            mostrarAlertaError('Error al eliminar decretos.', error.message || 'Ocurrió un error inesperado.');
            console.error('Error al eliminar decretos:', error);
        } finally {
            setLoading(false);
        }
    };

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

EliminarGeneracionDecretos.propTypes = {
    setLoading: PropTypes.func.isRequired,
};

export default EliminarGeneracionDecretos;
