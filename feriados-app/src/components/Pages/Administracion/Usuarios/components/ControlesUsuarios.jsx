import PropTypes from 'prop-types';

const ControlesUsuarios = ({ searchTerm, setSearchTerm, onAgregarUsuario }) => (
    <>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="gestion-usuarios-header">Gestión de Usuarios</h2>
            <button className="btn btn-primary gestion-usuarios-add-button" onClick={onAgregarUsuario}>
                <i className="bi bi-plus-lg me-2"></i>Agregar Usuario
            </button>
        </div>

        <div className="mb-3">
            <input
                type="text"
                className="form-control gestion-usuarios-search-input"
                placeholder="Buscar por nombre, login o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </>
);

ControlesUsuarios.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    onAgregarUsuario: PropTypes.func.isRequired,
};

export default ControlesUsuarios;
