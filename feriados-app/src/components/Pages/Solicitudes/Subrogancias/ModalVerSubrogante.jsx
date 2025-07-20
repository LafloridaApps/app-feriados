import PropTypes from 'prop-types';
import { useEffect } from 'react';

const ModalVerSubrogante = ({ show, onClose, subrogante, onEliminar }) => {
    useEffect(() => {
        const body = document.body;
        if (show) {
            body.classList.add('modal-open');
        } else {
            body.classList.remove('modal-open');
        }
        return () => body.classList.remove('modal-open');
    }, [show]);

    if (!show || !subrogante) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="modal-backdrop fade show"></div>

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Detalles del Subrogante</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Cerrar"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Nombre:</strong> {subrogante.nombreSubrogante}</p>
                            <p><strong>RUT:</strong> {subrogante.rutSubrogante}</p>
                            <p><strong>Departamento:</strong> {subrogante.departamentoSubrogante}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cerrar
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => onEliminar(subrogante)}
                            >
                                Eliminar Subrogancia
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

ModalVerSubrogante.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    subrogante: PropTypes.object,
    onEliminar: PropTypes.func.isRequired, // Nuevo prop obligatorio
};

export default ModalVerSubrogante;
