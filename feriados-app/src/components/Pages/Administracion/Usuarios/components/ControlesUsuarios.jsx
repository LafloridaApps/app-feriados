import PropTypes from 'prop-types';
export default function ControlesUsuarios({ searchTerm, setSearchTerm, onAgregarUsuario, disabled }) {
    return <div className="admin-toolbar">
        <div className="admin-search"><label htmlFor="buscar-usuario" className="form-label">Buscar usuario</label>
            <input id="buscar-usuario" type="search" className="form-control" placeholder="Nombre, login o RUT" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
        </div>
        <button type="button" className="btn btn-primary" disabled={disabled} onClick={onAgregarUsuario}><i className="bi bi-person-plus me-2" aria-hidden="true" />Agregar usuario</button>
    </div>;
}
ControlesUsuarios.propTypes = { searchTerm: PropTypes.string.isRequired, setSearchTerm: PropTypes.func.isRequired, onAgregarUsuario: PropTypes.func.isRequired, disabled: PropTypes.bool.isRequired };
