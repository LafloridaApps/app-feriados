import PropTypes from 'prop-types';
import BotonAnularSolicitud from './BotonAnularSolicitud';
import DocumentoSolicitud from './DocumentoSolicitud';

const DetalleGestionSolicitud = ({ solicitud, loading, handleAnular }) => (
    <div className="bg-white p-3 rounded shadow-sm border h-100 d-flex flex-column">
        <h5 className="text-primary fw-bold mb-4 border-bottom pb-3 d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-file-earmark-text fs-5"></i>
            </div>
            Detalles de la Solicitud #{solicitud.id}
        </h5>

        <div className="row g-4 mb-4 flex-grow-1">
            <div className="col-12">
                <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-person-fill me-1"></i>Funcionario</span>
                <div className="fw-medium text-dark bg-light p-2 rounded border border-light d-flex justify-content-between align-items-center">
                    <span>{solicitud.nombreFuncionario || 'N/A'}</span>
                    <span className="badge bg-white text-secondary border">{solicitud.rutFuncionario || 'N/A'}</span>
                </div>
            </div>
            <div className="col-12">
                <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-building me-1"></i>Departamento</span>
                <div className="fw-medium text-dark bg-light p-2 rounded border border-light">{solicitud.nombreDepartamento || 'N/A'}</div>
            </div>
            <div className="col-12">
                <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-tag-fill me-1"></i>Tipo Solicitud</span>
                <div><span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle px-3 py-2 w-100 text-start fs-6">{solicitud.tipoSolicitud || 'N/A'}</span></div>
            </div>
            <div className="col-6">
                <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-calendar-event me-1"></i>Desde</span>
                <div className="fw-medium text-dark"><span className="badge bg-light text-dark border px-3 py-2 w-100 text-center">{solicitud.fechaInicio || 'N/A'}</span></div>
            </div>
            <div className="col-6">
                <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-calendar-check me-1"></i>Hasta</span>
                <div className="fw-medium text-dark"><span className="badge bg-light text-dark border px-3 py-2 w-100 text-center">{solicitud.fechaFin || solicitud.fechaTermino || 'N/A'}</span></div>
            </div>
            <div className="col-12 mt-2 border-top pt-4 text-center">
                <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-info-circle-fill me-1"></i>Estado Actual</span>
                <span className={`badge ${solicitud.estadoSolicitud === 'ANULADA' ? 'bg-danger bg-opacity-10 text-danger border border-danger-subtle' : 'bg-primary bg-opacity-10 text-primary border border-primary-subtle'} rounded-pill px-4 py-2 fs-6 mt-1`}>
                    {solicitud.estadoSolicitud || 'N/A'}
                </span>
            </div>
        </div>

        <DocumentoSolicitud key={solicitud.id || solicitud.idSolicitud} solicitud={solicitud} />
        <BotonAnularSolicitud solicitud={solicitud} loading={loading} handleAnular={handleAnular} />
    </div>
);

DetalleGestionSolicitud.propTypes = {
    solicitud: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    handleAnular: PropTypes.func.isRequired,
};

export default DetalleGestionSolicitud;
