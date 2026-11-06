import PropTypes from 'prop-types';
import FiltrosEliminarDecretos from './EliminarGeneracionDecretos/FiltrosEliminarDecretos';
import AccionesEliminarDecretos from './EliminarGeneracionDecretos/AccionesEliminarDecretos';
import ResultadosEliminarDecretos from './EliminarGeneracionDecretos/ResultadosEliminarDecretos';
import { useEliminarGeneracionDecretos } from './EliminarGeneracionDecretos/useEliminarGeneracionDecretos';

const EliminarGeneracionDecretos = ({ setLoading }) => {
    const {
        fechaDesde, setFechaDesde, fechaHasta, setFechaHasta,
        searchPerformed, handleSearch, handleClear,
        selectedDecretos, handleSelectDecreto, handleSelectAllDecretos,
        handleDeleteSelected, results,
    } = useEliminarGeneracionDecretos(setLoading);

    return (
        <div className="card border-0 shadow-sm mb-4 rounded-16 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom border-light">
                <h5 className="mb-0 fw-bold text-danger d-flex align-items-center">
                    <i className="bi bi-trash-fill me-2"></i> Eliminar Decretos Generados
                </h5>
            </div>
            <div className="card-body p-4">
                <FiltrosEliminarDecretos fechaDesde={fechaDesde} setFechaDesde={setFechaDesde}
                    fechaHasta={fechaHasta} setFechaHasta={setFechaHasta}
                    handleClear={handleClear} handleSearch={handleSearch} />
                {results.length > 0 && (
                    <AccionesEliminarDecretos selectedDecretos={selectedDecretos}
                        handleDeleteSelected={handleDeleteSelected} />
                )}
                <ResultadosEliminarDecretos results={results} selectedDecretos={selectedDecretos}
                    handleSelectDecreto={handleSelectDecreto} handleSelectAllDecretos={handleSelectAllDecretos}
                    searchPerformed={searchPerformed} />
            </div>
        </div>
    );
};

EliminarGeneracionDecretos.propTypes = {
    setLoading: PropTypes.func.isRequired,
};

export default EliminarGeneracionDecretos;
