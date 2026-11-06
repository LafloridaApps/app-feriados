const SolicitudesPorMes = ({ porMes }) => {
    const maxPorMes = Math.max(...porMes.map(m => m.cantidad), 1);

    return (
        <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                    <h6 className="fw-bold text-secondary">Volumen de Solicitudes (Mensual)</h6>
                </div>
                <div className="card-body d-flex align-items-end mt-4" style={{ minHeight: '220px', gap: '4px' }}>
                    {porMes.map((m, idx) => (
                        <div key={`${m.mes}-${idx}`} className="d-flex flex-column align-items-center flex-fill h-100 justify-content-end group-hover">
                            <span className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>{m.cantidad}</span>
                            <div 
                                className="bg-primary rounded-top opacity-75 w-100" 
                                style={{ height: `${(m.cantidad / maxPorMes) * 100}%`, maxWidth: '40px', transition: 'height 0.5s ease' }}
                                title={`${m.cantidad} solicitudes en ${m.mes}`}
                            ></div>
                            <span className="small text-secondary mt-2 fw-medium">{m.mes}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SolicitudesPorMes;
