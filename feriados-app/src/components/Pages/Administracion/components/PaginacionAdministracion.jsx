import PropTypes from 'prop-types';

export default function PaginacionAdministracion({ page, setPage, size, setSize, totalElements, totalPages, loading }) {
    const inicio = totalElements === 0 ? 0 : page * size + 1;
    return <nav className="admin-toolbar mt-3 mb-0" aria-label="Paginación del listado">
        <output className="small text-secondary">{inicio}–{Math.min((page + 1) * size, totalElements)} de {totalElements} registros</output>
        <label className="d-flex gap-2 align-items-center small">
            <span>Por página</span>
            <select className="form-select form-select-sm w-auto" value={size} disabled={loading} onChange={event => setSize(Number(event.target.value))}>
                {[10, 25, 50].map(value => <option key={value} value={value}>{value}</option>)}
            </select>
        </label>
        <div className="d-flex gap-2 align-items-center">
            <button type="button" className="btn btn-outline-primary btn-sm" disabled={loading || page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
            <span className="small">Página {totalPages === 0 ? 0 : page + 1} de {totalPages}</span>
            <button type="button" className="btn btn-outline-primary btn-sm" disabled={loading || page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
    </nav>;
}
PaginacionAdministracion.propTypes = { page: PropTypes.number.isRequired, setPage: PropTypes.func.isRequired, size: PropTypes.number.isRequired, setSize: PropTypes.func.isRequired, totalElements: PropTypes.number.isRequired, totalPages: PropTypes.number.isRequired, loading: PropTypes.bool.isRequired };
