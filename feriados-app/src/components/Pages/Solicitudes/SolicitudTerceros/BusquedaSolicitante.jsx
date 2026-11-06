export default function BusquedaSolicitante({ rut, buscando, error, buscar, cambiarRut, abrirBusquedaNombre }) {
    return (
        <>
                <form onSubmit={buscar} className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label htmlFor="rut-solicitante" className="form-label">RUT del solicitante</label>
                        <input id="rut-solicitante" className="form-control" value={rut} required disabled={buscando}
                            aria-invalid={Boolean(error)} aria-describedby={error ? 'error-solicitante' : undefined}
                            onChange={e => cambiarRut(e.target.value)} placeholder="12345678-5" />
                    </div>
                    <div className="col-md-auto">
                        <button type="submit" className="btn btn-primary" disabled={buscando}>{buscando ? 'Buscando...' : 'Buscar solicitante'}</button>
                    </div>
                    <div className="col-md-auto">
                        <button type="button" className="btn btn-outline-primary" disabled={buscando}
                            onClick={abrirBusquedaNombre}>
                            <i className="bi bi-person-search me-2" />Buscar por nombre
                        </button>
                    </div>
                </form>
                {error && <p id="error-solicitante" role="alert" className="alert alert-warning mt-3 mb-0">{error}</p>}
        </>
    );
}
