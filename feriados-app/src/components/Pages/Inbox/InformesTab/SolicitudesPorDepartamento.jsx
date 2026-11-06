const SolicitudesPorDepartamento = ({ porDepartamento }) => {
    const maxPorDepto = Math.max(...porDepartamento.map(d => d.cantidad), 1);

    return (
        <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                    <h6 className="fw-bold text-secondary">Top Departamentos</h6>
                </div>
                <div className="card-body">
                    {porDepartamento.map(d => (
                        <div key={d.nombreDepto} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center small mb-1">
                                <span className="text-truncate me-2" style={{ maxWidth: '200px' }} title={d.nombreDepto}>{d.nombreDepto}</span>
                                <span className="fw-bold text-dark">{d.cantidad}</span>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                                <progress 
                                    className={`progress-bar ${d.color}`} 
                                    style={{ width: `${(d.cantidad / maxPorDepto) * 100}%` }}
                                    value={d.cantidad}
                                    max={maxPorDepto}
                                ></progress>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SolicitudesPorDepartamento;
