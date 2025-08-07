
import PropTypes from 'prop-types';

const SubroganteForm = ({ rut, setRut, handleBuscar, setShowBuscarPorNombreModal }) => (
    <div className="mb-3">
        <label htmlFor="rut" className="form-label">RUT del subrogante (sin puntos ni guion)</label>
        <input
            type="text"
            className="form-control"
            id="rut"
            value={rut}
            onChange={(e) => setRut(e.target.value.replace(/\D/g, ''))}
            placeholder="Ej: 12345678"
        />
        <button className="btn btn-primary mt-3" onClick={() => handleBuscar(rut)}>
            Buscar RUT
        </button>
        <button className="btn btn-outline-secondary mt-3 ms-2" onClick={() => setShowBuscarPorNombreModal(true)}>
            Buscar por Nombre
        </button>
    </div>
);

SubroganteForm.propTypes = {
    rut: PropTypes.string.isRequired,
    setRut: PropTypes.func.isRequired,
    handleBuscar: PropTypes.func.isRequired,
    setShowBuscarPorNombreModal: PropTypes.func.isRequired,
};

export default SubroganteForm;
