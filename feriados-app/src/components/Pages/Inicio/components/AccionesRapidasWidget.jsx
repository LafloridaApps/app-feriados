
const AccionesRapidasWidget = () => {
    return (
        <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm rounded-3 p-3 h-100 d-flex flex-column justify-content-between bg-white">
                <h5 className="card-title mb-3 text-secondary">Acciones Rápidas</h5>
                <div className="d-grid gap-2 flex-grow-1">
                    <a href="/solicitudes" className="btn btn-primary btn-lg">
                        <i className="bi bi-file-earmark-plus me-2"></i>Nueva Solicitud
                    </a>
                    <a href="/mis-solicitudes" className="btn btn-outline-secondary btn-lg">
                        <i className="bi bi-list-check me-2"></i>Mis Solicitudes
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AccionesRapidasWidget;
