import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFuncionario } from '../../../../hooks/useFuncionario';
import ModalBuscarPorNombre from './ModalBuscarPorNombre';

const ModalSubrogante = ({ show, onClose, onSubroganteSelected, rutFuncionario, deptoFuncionario }) => {
    const [rut, setRut] = useState('');
    const [errors, setErrors] = useState({ mensaje: '', detalle: '' });
    const [subrogante, setSubrogante] = useState({});

    const [showBuscarPorNombreModal, setShowBuscarPorNombreModal] = useState(false);

    const { consultarRut } = useFuncionario();

    const limpiarCampos = () => {
        setRut('');
        setErrors({ mensaje: '', detalle: '' });
        setSubrogante(null);
    };

    useEffect(() => {
        if (!show) {
            limpiarCampos();
        }
    }, [show]);

    const handleBuscar = async () => {

        setErrors({ mensaje: '', detalle: '' });
        setSubrogante(null);

        const rutLimpio = rut.replace(/\D/g, '');

        if (!rutLimpio) {
            setErrors({ mensaje: 'RUT inválido', detalle: 'Por favor, ingrese un RUT válido sin puntos ni guiones.' });
            return;
        }

        const vrut = rutLimpio.slice(-1);        // Último carácter = dígito verificador
        const rutSinDv = rutLimpio.slice(0, -1);



        try {
            const dataFuncionario = await consultarRut(rutSinDv, vrut);
            console.log(dataFuncionario)

            setSubrogante(dataFuncionario);

        } catch (error) {
            console.error('Error al consultar funcionario:', error);
            setSubrogante(null);

            if (error.response?.data) {
                setErrors({
                    mensaje: error.response.data.mensaje || 'Error desconocido',
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
        if (subrogante?.rut && subrogante?.nombre) {
            const subrogancia = {
                rutSubrogante: subrogante.rut,
                vutSubrogante: subrogante.vrut,
                nombreSubrogante: subrogante.nombre,
                departamentoSubrogante: subrogante.departamento,
                rutJefe: rutFuncionario,
                codDepto: deptoFuncionario



            }
            console.log(subrogancia)
            onSubroganteSelected(subrogancia);
            onClose();
        } else {
            setErrors({ mensaje: 'No hay subrogante seleccionado', detalle: 'Por favor, busque y seleccione un subrogante válido antes de confirmar.' });
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleFuncionarioSelectedFromSearch = (selectedFunc) => {
        setRut(selectedFunc.rut); // Establece el RUT en el campo principal
        setSubrogante(selectedFunc); // Establece el funcionario completo
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

                            {subrogante && (
                                <div className="alert alert-success">
                                    <strong>Nombre:</strong> {subrogante.nombre}
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
                            <button className="btn btn-success" onClick={handleConfirmar} disabled={!subrogante}>
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
                deptoFuncionario={deptoFuncionario}
            />
        </>
    );
};

ModalSubrogante.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubroganteSelected: PropTypes.func.isRequired,
    funcionario: PropTypes.shape({
        rut: PropTypes.number.isRequired,
    }).isRequired,
    deptoFuncionario: PropTypes.string.isRequired
};

export default ModalSubrogante;
