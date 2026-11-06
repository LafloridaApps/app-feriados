const ResumenInformes = ({ kpis }) => (
    <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm border-start border-4 border-primary h-100">
                <div className="card-body">
                    <p className="text-muted small mb-1">Total Solicitudes</p>
                    <h3 className="fw-bold mb-0 text-dark">{kpis.totalAnual}</h3>
                </div>
            </div>
        </div>
        <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm border-start border-4 border-success h-100">
                <div className="card-body">
                    <p className="text-muted small mb-1">Aprobadas</p>
                    <h3 className="fw-bold mb-0 text-success">{kpis.aprobadas}</h3>
                </div>
            </div>
        </div>
        <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm border-start border-4 border-warning h-100">
                <div className="card-body">
                    <p className="text-muted small mb-1">Pendientes</p>
                    <h3 className="fw-bold mb-0 text-warning">{kpis.pendientes}</h3>
                </div>
            </div>
        </div>
        <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm border-start border-4 border-danger h-100">
                <div className="card-body">
                    <p className="text-muted small mb-1">Postergadas</p>
                    <h3 className="fw-bold mb-0 text-danger">{kpis.postergadas}</h3>
                </div>
            </div>
        </div>
    </div>
);

export default ResumenInformes;
