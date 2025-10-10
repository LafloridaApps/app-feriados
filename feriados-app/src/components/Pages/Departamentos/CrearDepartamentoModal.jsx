import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { getFuncionarioLocalByRut } from '../../../services/funcionarioService';
import { createDepartamento } from '../../../services/departamentosService';

const CrearDepartamentoModal = ({ show, onHide, parent, fetchDepartamentos }) => {
    const [nombre, setNombre] = useState('');
    const [rutCompleto, setRutCompleto] = useState('');
    const [nombreJefe, setNombreJefe] = useState('');
    const [isSaveDisabled, setSaveDisabled] = useState(true);

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
        const input = rutCompleto.replace(/\./g, '').replace('-', '').toUpperCase();
        if (input.length < 2) {
            setNombreJefe('');
            return;
        }
        const cuerpo = input.slice(0, -1);
        const dv = input.slice(-1);

        try {
            const result = await getFuncionarioLocalByRut(cuerpo + dv);
            setNombreJefe(result.nombre);
        } catch (error) {
            setNombreJefe('');
            Swal.fire('Error', error.response?.data?.detalle || 'No se pudo encontrar al funcionario.', 'error');
        }
    };

    const handleGuardar = async () => {
        const rutJefe = rutCompleto ? rutCompleto.split('-')[0].replace(/\./g, '') : null;
        const deptoData = {
            nombre,
            rut_jefe: rutJefe,
            id_depto_padre: parent.id,
        };

        try {
            await createDepartamento(deptoData);
            Swal.fire('¡Creado!', 'El nuevo departamento ha sido creado con éxito.', 'success');
            fetchDepartamentos();
            onHide();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.detalle || 'No se pudo crear el departamento.', 'error');
        }
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
                                <label className="form-label">Dependiente de:</label>
                                <input type="text" className="form-control" readOnly disabled value={parent ? parent.nombre : 'Raíz'} />
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
                                <input
                                    type="text"
                                    className="form-control"
                                    id="rutJefe"
                                    value={rutCompleto}
                                    onChange={(e) => setRutCompleto(e.target.value)}
                                    onBlur={handlerOnBlurRut}
                                    placeholder='Ej: 12345678-9'
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nombre del Jefe</label>
                                <input type="text" className="form-control" readOnly disabled value={nombreJefe} />
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
