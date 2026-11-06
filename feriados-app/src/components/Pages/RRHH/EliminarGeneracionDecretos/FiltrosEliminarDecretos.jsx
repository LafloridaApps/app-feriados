import PropTypes from 'prop-types';

const FiltrosEliminarDecretos = ({ fechaDesde, setFechaDesde, fechaHasta, setFechaHasta, handleClear, handleSearch }) => {
    return (
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
    );
};

FiltrosEliminarDecretos.propTypes = {
    fechaDesde: PropTypes.string.isRequired,
    setFechaDesde: PropTypes.func.isRequired,
    fechaHasta: PropTypes.string.isRequired,
    setFechaHasta: PropTypes.func.isRequired,
    handleClear: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
};

export default FiltrosEliminarDecretos;
