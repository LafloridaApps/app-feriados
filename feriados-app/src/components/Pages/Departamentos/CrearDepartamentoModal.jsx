import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { getFuncionarioLocalByRut } from '../../../services/funcionarioService';
import { agregarDepartamento } from '../../../services/departamentosService';
import { validarRut } from '../../../services/utils';
import ModalBuscarPorNombre from '../../Common/ModalBuscarPorNombre';
import { FaSearch } from 'react-icons/fa';

const CrearDepartamentoModal = ({ show, onHide, parent, fetchDepartamentos }) => {
    const [nombre, setNombre] = useState('');
    const [rutCompleto, setRutCompleto] = useState('');
    const [nombreJefe, setNombreJefe] = useState('');
    const [isSaveDisabled, setSaveDisabled] = useState(true);
    const [showBuscarNombre, setShowBuscarNombre] = useState(false);

    useEffect(() => {
        if (show) {
            // Resetear estado cuando el modal se muestra
            setNombre('');
            setRutCompleto('');
            setNombreJefe('');
            setSaveDisabled(true);
        }
    }, [show]);

    useEffect(() => {
        // Habilitar el botón de guardar solo si el nombre del depto no está vacío
        setSaveDisabled(!nombre.trim());
    }, [nombre]);

    const handlerOnBlurRut = async () => {
        if (!rutCompleto.trim()) {
            setNombreJefe('');
            return;
        }

        if (rutCompleto.includes('.')) {
            Swal.fire('Error', 'El RUT debe ser ingresado sin puntos.', 'error');
            setNombreJefe('');
            return;
        }

        const partes = rutCompleto.split('-');
        if (partes.length !== 2 || partes[1].length !== 1) {
            Swal.fire('Error', 'El RUT debe contener un guión antes del dígito verificador.', 'error');
            setNombreJefe('');
            return;
        }

        const rutLimpio = rutCompleto.replaceAll('-', '').toUpperCase();

        if (!validarRut(rutLimpio)) {
            Swal.fire('Error', 'El RUT ingresado no es válido. Verifique el formato y dígito verificador.', 'error');
            setNombreJefe('');
            return;
        }

        const cuerpo = partes[0];

        try {
            const { data } = await getFuncionarioLocalByRut(cuerpo);
            const nombreEncontrado = [data.nombre, data.apellidoPaterno, data.apellidoMaterno].filter(Boolean).join(' ');
            setNombreJefe(nombreEncontrado);
        } catch (error) {
            setNombreJefe('');
            Swal.fire('Error', error.response?.data?.detalle || 'No se pudo encontrar al funcionario.', 'error');
        }
    };

    const handleGuardar = async () => {
        // Validación final de campos antes del confirm
        if (!nombre.trim()) {
            Swal.fire('Error', 'Debe ingresar un nombre para el departamento.', 'error');
            return;
        }

        let rutJefeNumerico = null;
        if (rutCompleto) {
            const rutLimpio = rutCompleto.replaceAll('-', '').toUpperCase();
            if (!validarRut(rutLimpio) || !nombreJefe) {
                Swal.fire('Error', 'El RUT del jefe ingresado no es válido o no ha sido encontrado.', 'error');
                return;
            }
            rutJefeNumerico = Number(rutCompleto.split('-')[0]);
        }

        // Mensaje de confirmación dinámico
        const textoConfirmacion = rutJefeNumerico 
            ? `Se creará el departamento "${nombre}" con jefatura asignada.`
            : `Está a punto de crear el departamento "${nombre}" SIN jefatura asignada. ¿Desea continuar de todos modos?`;

        Swal.fire({
            title: '¿Confirmar creación?',
            text: textoConfirmacion,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, crear',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const deptoData = {
                    idPadre: parent ? parent.id : null,
                    nombreDepartamento: nombre,
                    rutJefe: rutJefeNumerico
                };

                try {
                    const response = await agregarDepartamento(deptoData);
                    Swal.fire('¡Éxito!', response.message || 'Departamento agregado con éxito.', 'success');
                    fetchDepartamentos();
                    onHide();
                } catch (error) {
                    Swal.fire('Error', error.response?.data?.detalle || 'No se pudo crear el departamento.', 'error');
                }
            }
        });
    };

    if (!show) {
        return null;
    }

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Crear Nuevo Departamento</h5>
                            <button type="button" className="btn-close" onClick={onHide}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="deptoPadre" className="form-label">Dependiente de:</label>
                                <input id="deptoPadre" type="text" className="form-control" readOnly disabled value={parent ? parent.nombre : 'Raíz (Nivel Principal)'} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombreDepto" className="form-label">Nombre del Nuevo Departamento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombreDepto"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder='Ej: Oficina de Partes'
                                />
                            </div>
                            <hr />
                            <h6 className="text-muted">Asignar Jefe (Opcional)</h6>
                            <div className="mb-3">
                                <label htmlFor="rutJefe" className="form-label">RUT del Jefe</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="rutJefe"
                                        value={rutCompleto}
                                        onChange={(e) => setRutCompleto(e.target.value)}
                                        placeholder='Ej: 12345678-9'
                                    />
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button" 
                                        onClick={() => setShowBuscarNombre(true)}
                                        title="Buscar por nombre"
                                    >
                                        <FaSearch className="me-1" /> Buscar Nombre
                                    </button>
                                    <button 
                                        className="btn btn-outline-primary" 
                                        type="button" 
                                        onClick={handlerOnBlurRut}
                                    >
                                        Buscar RUT
                                    </button>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nombreJefeDisplay" className="form-label">Nombre del Jefe</label>
                                <input id="nombreJefeDisplay" type="text" className="form-control" readOnly disabled value={nombreJefe} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleGuardar} disabled={isSaveDisabled}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>

            <ModalBuscarPorNombre
                show={showBuscarNombre}
                onClose={() => setShowBuscarNombre(false)}
                onSelected={(func) => {
                    setRutCompleto(`${func.rut}-${func.vrut}`);
                    setNombreJefe(func.nombreCompleto);
                }}
            />
        </>
    );
};

CrearDepartamentoModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    parent: PropTypes.object,
    fetchDepartamentos: PropTypes.func.isRequired,
};

export default CrearDepartamentoModal;
