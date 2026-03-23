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
                        <div className="modal-header dashboard-modal-header border-0">
                            <h5 className="modal-title fw-bold text-white" id="employeeModalLabel">Detalles del Funcionario</h5>
                            <button type="button" className="btn-close btn-close-white shadow-none" aria-label="Close" onClick={manejarCerrarModal}></button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="p-4 bg-white">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="bg-primary bg-gradient text-white rounded-circle d-flex justify-content-center align-items-center me-3 shadow-lg" style={{ width: '70px', height: '70px', fontSize: '30px', fontWeight: '800' }}>
                                        {empleadoSeleccionado?.nombre ? empleadoSeleccionado.nombre.charAt(0).toUpperCase() : 'F'}
                                    </div>
                                    <div>
                                        <h4 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>{empleadoSeleccionado?.nombre}</h4>
                                        <span className="text-muted d-block fw-medium" style={{ fontSize: '0.9rem' }}>RUT: {empleadoSeleccionado?.rut}</span>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-sm-6">
                                        <div className="info-card h-100 border-start border-4 border-info">
                                            <span className="d-block text-muted small fw-bold text-uppercase mb-2 letter-spacing-1">Motivo</span>
                                            <span className="badge bg-info bg-opacity-10 text-info fs-6 px-3 py-2 rounded-pill fw-bold border border-info-subtle">
                                                {empleadoSeleccionado?.motivo}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="info-card h-100 border-start border-4 border-primary">
                                            <span className="d-block text-muted small fw-bold text-uppercase mb-2 letter-spacing-1">Solicitud</span>
                                            <div className="d-flex align-items-center">
                                                <span className="fw-bolder text-dark fs-4">#{empleadoSeleccionado?.idSolicitud}</span>
                                            </div>
                                            <span className="small text-muted fw-medium d-block mt-1">
                                                Aprobación: {empleadoSeleccionado?.fechaAprobacion}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center text-dark" style={{ fontSize: '1.1rem' }}>
                                        <i className="bi bi-calendar3 me-2 text-primary"></i> Período de Ausencia
                                    </h6>
                                    <div className="p-3 rounded-4 bg-light border border-light-subtle">
                                        {renderizarMiniCalendario(empleadoSeleccionado?.periodoAusencia)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bg-light border-0 py-3 px-4">
                            <button type="button" className="btn btn-secondary px-4 fw-bold rounded-pill shadow-sm" onClick={manejarCerrarModal}>Cerrar</button>
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
