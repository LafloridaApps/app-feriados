import PropTypes from 'prop-types';
export default function EstadoListado({ loading, error, onRetry }) {
    if (loading) return <output className="admin-empty d-block"><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Cargando información…</output>;
    if (!error) return null;
    return <div className="alert alert-danger" role="alert">{error}<button type="button" className="btn btn-sm btn-outline-danger ms-3" onClick={onRetry}>Reintentar</button></div>;
}
EstadoListado.propTypes = { loading: PropTypes.bool.isRequired, error: PropTypes.string.isRequired, onRetry: PropTypes.func.isRequired };
