import PropTypes from 'prop-types';
import { formatFecha } from '../../../services/utils';

const AnalisisCobertura = ({ traslapes }) => {
    return (
        <div className="p-4 bg-light" style={{ minHeight: '400px' }}>
            <div className="alert alert-info border-0 shadow-sm mb-4">
                <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                <strong>Información de Cobertura:</strong> El siguiente listado agrupa las solicitudes de tu bandeja que comparten departamento y tienen fechas superpuestas. Revisa estas coincidencias de forma informativa antes de visar o firmar para asegurar la continuidad del servicio.
            </div>

            {traslapes.length === 0 ? (
                <div className="text-center p-5 bg-white rounded-3 shadow-sm border text-muted">
                    <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
                    <h5 className="fw-bold">Todo en orden</h5>
                    <p className="mb-0">No se han detectado solicitudes pendientes con fechas traslapadas en el mismo departamento.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {traslapes.map(grupo => (
                        <div className="col-12" key={grupo.id}>
                            <div className="card border-warning shadow-sm">
                                <div className="card-header bg-warning bg-opacity-10 border-warning py-3 d-flex align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-warning text-dark rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px' }}>
                                            <i className="bi bi-buildings-fill fs-5"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold text-dark">Departamento: {grupo.departamento}</h6>
                                            <small className="text-muted">Traslape de {grupo.solicitudes.length} solicitudes detectado</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="ps-4">ID</th>
                                                    <th>Funcionario</th>
                                                    <th>Tipo</th>
                                                    <th>Desde</th>
                                                    <th>Hasta</th>
                                                    <th className="pe-4 text-end">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {grupo.solicitudes.map(sol => (
                                                    <tr key={sol.id}>
                                                        <td className="ps-4 fw-bold text-secondary">#{sol.id}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                {sol.nombreFuncionario}
                                                            </div>
                                                        </td>
                                                        <td><span className="badge bg-secondary bg-opacity-10 text-secondary border">{sol.tipoSolicitud}</span></td>
                                                        <td><i className="bi bi-calendar-event me-2 text-muted"></i>{sol.fechaInicio ? formatFecha(sol.fechaInicio) : 'N/A'}</td>
                                                        <td><i className="bi bi-calendar-check me-2 text-muted"></i>{(sol.fechaFin || sol.fechaTermino) ? formatFecha(sol.fechaFin || sol.fechaTermino) : 'N/A'}</td>
                                                        <td className="pe-4 text-end">
                                                            <span className="badge bg-primary rounded-pill">{sol.estadoSolicitud}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

AnalisisCobertura.propTypes = {
    traslapes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            departamento: PropTypes.string.isRequired,
            solicitudes: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    nombreFuncionario: PropTypes.string,
                    tipoSolicitud: PropTypes.string,
                    fechaInicio: PropTypes.string,
                    fechaFin: PropTypes.string,
                    fechaTermino: PropTypes.string,
                    estadoSolicitud: PropTypes.string,
                })
            ).isRequired,
        })
    ).isRequired,
};

export default AnalisisCobertura;
