const obtenerLeyendaFoto = (solicitante, fotoVisible) => {
    if (!solicitante) return 'Foto del solicitante';
    if (!fotoVisible) return 'Sin foto disponible';
    return 'Solicitante';
};

export default function FichaSolicitante({ solicitante, fotoVisible, ocultarFoto }) {
    const leyendaFoto = obtenerLeyendaFoto(solicitante, fotoVisible);

    return (
                <div className="d-flex flex-column flex-md-row gap-4 align-items-start mt-4">
                    <div className="text-center flex-shrink-0">
                        <div className="rounded-circle border bg-light overflow-hidden d-flex align-items-center justify-content-center"
                            style={{ width: 112, height: 112 }}>
                            {fotoVisible ? (
                                <img src={fotoVisible} alt={`Foto de ${solicitante?.nombreCompleto || solicitante?.nombre || 'solicitante'}`}
                                    className="w-100 h-100" style={{ objectFit: 'cover' }} onError={ocultarFoto} />
                            ) : (
                                <i className="bi bi-person text-secondary" style={{ fontSize: '3rem' }} aria-hidden="true" />
                            )}
                        </div>
                        <span className="small text-muted d-block mt-2">{leyendaFoto}</span>
                    </div>
                    <div className="row g-3 flex-grow-1 w-100">
                    {[
                        ['nombre-solicitante', 'Nombre completo', solicitante?.nombreCompleto || solicitante?.nombre],
                        ['departamento-solicitante', 'Departamento', solicitante?.departamento],
                        ['correo-solicitante', 'Correo electrónico', solicitante?.email],
                    ].map(([id, label, value]) => (
                        <div className="col-md-6" key={id}>
                            <label htmlFor={id} className="form-label">{label}</label>
                            <input id={id} className="form-control" readOnly disabled={!solicitante}
                                value={value || ''} placeholder={solicitante ? 'Sin información' : 'Pendiente de consultar RUT'} />
                        </div>
                    ))}
                    </div>
                </div>
    );
}
