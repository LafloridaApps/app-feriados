const FiltrosInformes = ({ departamentos, filtroDepto, setFiltroDepto, filtroAnio, setFiltroAnio }) => (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-light p-3 rounded border">
        <h5 className="mb-3 mb-md-0 text-secondary fw-bold">
            Resumen de Permisos
        </h5>
        <div className="d-flex gap-2">
            <select 
                className="form-select form-select-sm" 
                value={filtroDepto} 
                onChange={(e) => setFiltroDepto(e.target.value)}
            >
                {departamentos.map(d => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
            </select>
            <select 
                className="form-select form-select-sm" 
                value={filtroAnio} 
                onChange={(e) => setFiltroAnio(e.target.value)}
                style={{ width: '100px' }}
            >
                {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2].map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>
    </div>
);

export default FiltrosInformes;
