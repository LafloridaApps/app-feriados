import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFuncionario } from '../../../../hooks/useFuncionario';
import ModalBuscarPorNombre from './ModalBuscarPorNombre';

const ModalSubrogante = ({ show, onClose, onSubroganteSelected }) => {
    const [rut, setRut] = useState('');
    const [errors, setErrors] = useState({ mensaje: '', detalle: '' });
    const [funcionario, setFuncionario] = useState(null);

    const [showBuscarPorNombreModal, setShowBuscarPorNombreModal] = useState(false);

    const { consultarRut } = useFuncionario();

    const limpiarCampos = () => {
        setRut('');
        setErrors({ mensaje: '', detalle: '' });
        setFuncionario(null);
    };

    useEffect(() => {
        if (!show) {
            limpiarCampos();
        }
    }, [show]);

    const handleBuscar = async () => {

        setErrors({ mensaje: '', detalle: '' });
        setFuncionario(null);

        const rutLimpio = rut.replace(/\D/g, '');

        if (!rutLimpio) {
            setErrors({ mensaje: 'RUT inválido', detalle: 'Por favor, ingrese un RUT válido sin puntos ni guiones.' });
            return;
        }

        try {
            const dataFuncionario = await consultarRut(rutLimpio);

            setFuncionario(dataFuncionario.data);

        } catch (error) {
            console.error('Error al consultar funcionario:', error);
            setFuncionario(null);

            if (error.response?.data) {
                setErrors({
                    mensaje: error.response.data.mensaje || 'Error desconocido',
                    detalle: error.response.data.detalle || 'Ocurrió un problema al buscar el funcionario.'
                });
            } else if (error.message) {
                setErrors({
                    mensaje: 'Error de red o conexión',
                    detalle: error.message
                });
            } else {
                setErrors({
                    mensaje: 'Error inesperado',
                    detalle: 'Ocurrió un error al buscar el funcionario.'
                });
            }
        }
    };

    const handleConfirmar = () => {
        if (funcionario?.rut && funcionario?.nombre) {
            // Pasa el rut y el nombre del funcionario seleccionado al componente padre
            onSubroganteSelected({ rut: funcionario.rut, nombre: funcionario.nombre });
            // La limpieza de campos del modal principal la manejará useEffect al cerrar el modal
            onClose();
        } else {
            setErrors({ mensaje: 'No hay subrogante seleccionado', detalle: 'Por favor, busque y seleccione un subrogante válido antes de confirmar.' });
        }
    };

    const handleClose = () => {
        // Solo cierra el modal principal, useEffect se encargará de limpiar
        onClose();
    };

    const handleFuncionarioSelectedFromSearch = (selectedFunc) => {
        setRut(selectedFunc.rut); // Establece el RUT en el campo principal
        setFuncionario(selectedFunc); // Establece el funcionario completo
        setErrors({ mensaje: '', detalle: '' }); // Limpia errores
        setShowBuscarPorNombreModal(false); // Cierra el modal de búsqueda por nombre
    };

    return (
        <>
            <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content shadow">
                        <div className="modal-header">
                            <h5 className="modal-title">Asignar Subrogante</h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="rut" className="form-label">RUT del subrogante (sin puntos ni guion)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="rut"
                                    value={rut}
                                    onChange={(e) => setRut(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Ej: 12345678"
                                />
                            </div>
                            <button className="btn btn-primary mb-3" onClick={handleBuscar}>
                                Buscar  RUT
                            </button>
                            <button className="btn btn-outline-secondary mb-3 ms-2" onClick={() => setShowBuscarPorNombreModal(true)}>
                                Buscar por Nombre
                            </button>

                            {funcionario && (
                                <div className="alert alert-success">
                                    <strong>Nombre:</strong> {funcionario.nombre}
                                </div>
                            )}
                            {errors.mensaje != '' && (
                                <div className="alert alert-danger">
                                    {errors.mensaje} <br />
                                    {errors.detalle}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                            <button className="btn btn-success" onClick={handleConfirmar} disabled={!funcionario}>
                                Confirmar Subrogante
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalBuscarPorNombre
                show={showBuscarPorNombreModal}
                onClose={() => setShowBuscarPorNombreModal(false)}
                onFuncionarioSelected={handleFuncionarioSelectedFromSearch}
            />
        </>
    );
};

ModalSubrogante.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubroganteSelected: PropTypes.func.isRequired
};

export default ModalSubrogante;
