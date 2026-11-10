import PropTypes from 'prop-types';
export default function FormularioModulo({ nombre, setNombre, saving, disabled, onSubmit, error, mensaje }) {
    return <aside className="admin-panel">
        <h2 className="h5">Nuevo módulo</h2><p className="text-secondary small">Cree un módulo para asignarlo a los usuarios.</p>
        <form onSubmit={onSubmit}>
            <label htmlFor="nombre-modulo" className="form-label">Nombre del módulo</label>
            <input id="nombre-modulo" className="form-control mb-3" value={nombre} onChange={event => setNombre(event.target.value)} disabled={saving} required maxLength={255} />
            <button className="btn btn-primary w-100" type="submit" disabled={disabled || saving}>{saving ? 'Guardando…' : 'Crear módulo'}</button>
        </form>
        {error && <p className="text-danger mt-3 mb-0" role="alert">{error}</p>}
        {mensaje && <output className="text-success d-block mt-3 mb-0">{mensaje}</output>}
    </aside>;
}
FormularioModulo.propTypes = { nombre: PropTypes.string.isRequired, setNombre: PropTypes.func.isRequired, saving: PropTypes.bool.isRequired, disabled: PropTypes.bool.isRequired, onSubmit: PropTypes.func.isRequired, error: PropTypes.string.isRequired, mensaje: PropTypes.string.isRequired };
