import React from 'react';
import PropTypes from 'prop-types';

const ModalDetalleFuncionario = ({
    empleadoSeleccionado,
    mostrarModalEmpleado,
    manejarCerrarModal,
    renderizarMiniCalendario
}) => {
    if (!empleadoSeleccionado) return null;

    return (
        <>
            <div className={`modal fade ${mostrarModalEmpleado ? 'show' : ''}`} style={{ display: mostrarModalEmpleado ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="employeeModalLabel" aria-hidden={!mostrarModalEmpleado}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header dashboard-modal-header bg-primary text-white border-0">
                            <h5 className="modal-title fw-bold" id="employeeModalLabel">Detalles del Funcionario</h5>
                            <button type="button" className="btn-close btn-close-white shadow-none" aria-label="Close" onClick={manejarCerrarModal}></button>
                        </div>
                        <div className="modal-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-primary bg-gradient text-white rounded-circle d-flex justify-content-center align-items-center me-3 shadow" style={{ width: '64px', height: '64px', fontSize: '28px' }}>
                                    {empleadoSeleccionado?.nombre ? empleadoSeleccionado.nombre.charAt(0).toUpperCase() : 'F'}
                                </div>
                                <div>
                                    <h5 className="mb-1 fw-bold text-dark" style={{ letterSpacing: '-0.3px' }}>{empleadoSeleccionado?.nombre}</h5>
                                    <span className="text-secondary d-block" style={{ fontSize: '0.95rem' }}>RUT: {empleadoSeleccionado?.rut}</span>
                                </div>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-12 col-sm-6">
                                    <div className="p-3 bg-light rounded-4 shadow-sm h-100 border-start border-4 border-info position-relative overflow-hidden">
                                        <span className="d-block text-muted small fw-bold text-uppercase mb-2 letter-spacing-1">Motivo</span>
                                        <span className="badge bg-info text-dark fs-6 px-3 py-2 rounded-pill shadow-sm">{empleadoSeleccionado?.motivo}</span>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <div className="p-3 bg-light rounded-4 shadow-sm h-100 border-start border-4 border-secondary">
                                        <span className="d-block text-muted small fw-bold text-uppercase mb-2 letter-spacing-1">Solicitud</span>
                                        <div className="d-flex align-items-center mb-1">
                                            <span className="d-block fw-bolder text-dark fs-5">#{empleadoSeleccionado?.idSolicitud}</span>
                                        </div>
                                        <span className="small text-secondary d-flex align-items-center fw-medium">
                                            Aprobado: {empleadoSeleccionado?.fechaAprobacion}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2">
                                <h6 className="fw-bold mb-3 d-flex align-items-center text-dark" style={{ fontSize: '1.1rem' }}>
                                    <span className="fs-4 me-2">📅</span> Período de Ausencia
                                </h6>
                                <div className="p-3 rounded-4 shadow-sm bg-white border border-light-subtle">
                                    {renderizarMiniCalendario(empleadoSeleccionado?.periodoAusencia)}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bg-light rounded-bottom-4 border-top-0 py-3">
                            <button type="button" className="btn btn-secondary px-4 fw-medium rounded-pill shadow-sm" onClick={manejarCerrarModal}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            {mostrarModalEmpleado && <div className="modal-backdrop fade show"></div>}
        </>
    );
};


ModalDetalleFuncionario.propTypes = {
    empleadoSeleccionado: PropTypes.object,
    mostrarModalEmpleado: PropTypes.bool,
    manejarCerrarModal: PropTypes.func,
    renderizarMiniCalendario: PropTypes.func
};
export default ModalDetalleFuncionario;
