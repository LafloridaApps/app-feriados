import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { getFuncionarioLocalByRut } from '../../../services/funcionarioService';
import { updateJefeDeptoById, updateDepartamentoById } from '../../../services/departamentosService';

const DetallesJefe = ({ departamento, fetchDepartamentos, jefeSeleccionado, isJefeLoading }) => {

    const [enEdicion, setEnEdicion] = useState(false);
    const [nombreJefeEditado, setNombreJefeEditado] = useState('');
    const [rutCompleto, setRutCompleto] = useState('');
    const [codigoExterno, setCodigoExterno] = useState('');
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (departamento) {
            // Si tenemos el objeto detallado del jefe, lo usamos como fuente de verdad
            if (jefeSeleccionado) {
                const nombre = [jefeSeleccionado.nombre, jefeSeleccionado.apellidoPaterno, jefeSeleccionado.apellidoMaterno].filter(Boolean).join(' ');
                setNombreJefeEditado(nombre);
                setRutCompleto(jefeSeleccionado.rut ? `${jefeSeleccionado.rut}-${jefeSeleccionado.vrut}` : '');
            } else { // Si no, usamos los datos del objeto departamento (que pueden ser menos detallados)
                setNombreJefeEditado(departamento.nombreJefe || '');
                setRutCompleto(departamento.rutJefe ? `${departamento.rutJefe}-${departamento.vrutJefe}` : '');
            }
            setCodigoExterno(departamento.codigoExterno || '');
        } else {
            // Limpiar todo si no hay departamento seleccionado
            setNombreJefeEditado('');
            setRutCompleto('');
            setCodigoExterno('');
        }
    }, [departamento, jefeSeleccionado]);

    const handleEditar = () => {
        setEnEdicion(true);
    };

    const handleGuardarJefe = () => {
        Swal.fire({
            title: '¿Está seguro de guardar el jefe?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const rutNumerico = rutCompleto.split('-')[0].replace(/\./g, '');
                    await updateJefeDeptoById(departamento.id, rutNumerico);
                    Swal.fire('¡Guardado!', 'El jefe del departamento ha sido actualizado.', 'success');
                    fetchDepartamentos();
                    setEnEdicion(false);
                } catch (error) {
                    Swal.fire('Error', error.response?.data?.detalle || 'No se pudo guardar.', 'error');
                }
            }
        });
    };
    
    const handleGuardarCodigoExterno = () => {
        Swal.fire({
            title: '¿Está seguro de guardar el código externo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateDepartamentoById(departamento.id, { codigo_externo: codigoExterno });
                    Swal.fire('¡Guardado!', 'El código externo ha sido actualizado.', 'success');
                    fetchDepartamentos();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo actualizar el código externo.', error.response);
                }
            }
        });
    };

    const handleBuscarJefePorRut = async () => {
        const input = rutCompleto.replace(/\./g, '').replace('-', '').toUpperCase();
        if (input.length < 2) {
            setNombreJefeEditado('');
            setDisabled(true);
            return;
        }
        const cuerpo = input.slice(0, -1);
        const dv = input.slice(-1);
        try {
            const result = await getFuncionarioLocalByRut(cuerpo + dv);
            const nombreCompleto = [result.nombre, result.apellidoPaterno, result.apellidoMaterno].filter(Boolean).join(' ');
            setNombreJefeEditado(nombreCompleto);
            setDisabled(false);
        } catch (error) {
            setDisabled(true);
            Swal.fire('Error', error.response?.data?.detalle || 'No se pudo obtener el funcionario', 'error');
        }
    };

    const handleCancelar = () => {
        setEnEdicion(false);
        setDisabled(false);
        // Re-inicializar con los datos originales
        if (jefeSeleccionado) {
            const nombre = [jefeSeleccionado.nombre, jefeSeleccionado.apellidoPaterno, jefeSeleccionado.apellidoMaterno].filter(Boolean).join(' ');
            setNombreJefeEditado(nombre);
            setRutCompleto(jefeSeleccionado.rut ? `${jefeSeleccionado.rut}-${jefeSeleccionado.vrut}` : '');
        } else if (departamento) {
            setNombreJefeEditado(departamento.nombreJefe || '');
            setRutCompleto(departamento.rutJefe ? `${departamento.rutJefe}-${departamento.vrutJefe}` : '');
        }
    };

    // --- Renderizado de campos --- //
    const renderNombre = () => {
        if (isJefeLoading) return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>;
        if (jefeSeleccionado) {
            return [jefeSeleccionado.nombre, jefeSeleccionado.apellidoPaterno, jefeSeleccionado.apellidoMaterno].filter(Boolean).join(' ');
        }
        return departamento.nombreJefe || 'No disponible';
    };

    const renderRut = () => {
        if (isJefeLoading) return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>;
        if (jefeSeleccionado) return `${jefeSeleccionado.rut}-${jefeSeleccionado.vrut}`;
        if (departamento.rutJefe) return `${departamento.rutJefe}-${departamento.vrutJefe}`;
        return 'No disponible';
    };

    const renderEmail = () => {
        if (isJefeLoading) return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>;
        return (jefeSeleccionado && jefeSeleccionado.email) || departamento.email || 'No disponible';
    };

    return (
        <div className="card p-3">
            {departamento ? (
                <>
                    <h5 className="card-title">Jefe de Departamento</h5>
                    {enEdicion ? (
                        <>
                            <div className="mb-2">
                                <label className="form-label form-label-sm">Nombre</label>
                                <input type="text" className="form-control form-control-sm" readOnly value={nombreJefeEditado} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label form-label-sm">RUT</label>
                                <div className="input-group">
                                    <input type="text" className="form-control form-control-sm" onChange={(e) => setRutCompleto(e.target.value)} value={rutCompleto} />
                                    <button className="btn btn-outline-secondary btn-sm" type="button" onClick={handleBuscarJefePorRut}>Buscar</button>
                                </div>
                            </div>
                            <div className="d-flex gap-2 mt-3">
                                <button className="btn btn-sm btn-success" onClick={handleGuardarJefe} disabled={disabled}>Guardar Jefe</button>
                                <button className="btn btn-sm btn-secondary" onClick={handleCancelar}>Cancelar</button>
                            </div>
                        </>
                    ) : (
                        <>
                            {departamento.rutJefe ? (
                                <div className="mb-3">
                                    <div className="row g-2 align-items-center mb-2">
                                        <div className="col-3"><strong className="text-muted small">Nombre:</strong></div>
                                        <div className="col-9">{renderNombre()}</div>
                                    </div>
                                    <div className="row g-2 align-items-center mb-2">
                                        <div className="col-3"><strong className="text-muted small">RUT:</strong></div>
                                        <div className="col-9">{renderRut()}</div>
                                    </div>
                                    <div className="row g-2 align-items-center">
                                        <div className="col-3"><strong className="text-muted small">Email:</strong></div>
                                        <div className="col-9">{renderEmail()}</div>
                                    </div>
                                </div>
                            ) : (
                                <p className="card-text text-muted">Este departamento no tiene un jefe asignado.</p>
                            )}
                            <button className="btn btn-sm btn-primary" onClick={handleEditar}>Editar Jefe</button>
                        </>
                    )}

                    <hr />

                    <h5 className="card-title mt-3">Código Externo</h5>
                    <div className="mb-2">
                        <label htmlFor="codigoExterno" className="form-label form-label-sm">Código</label>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            id="codigoExterno"
                            value={codigoExterno}
                            onChange={(e) => setCodigoExterno(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-sm btn-success" onClick={handleGuardarCodigoExterno}>Guardar Código</button>
                </>
            ) : (
                <p className="card-text">Seleccione un departamento para ver los detalles.</p>
            )}
        </div>
    );
}

export default DetallesJefe;

DetallesJefe.propTypes = {
    fetchDepartamentos: PropTypes.func.isRequired,
    departamento: PropTypes.shape({
        id: PropTypes.any.isRequired,
        nombreJefe: PropTypes.string,
        rutJefe: PropTypes.any,
        vrutJefe: PropTypes.any,
        email: PropTypes.any,
        codigoExterno: PropTypes.string,
    }),
    jefeSeleccionado: PropTypes.shape({
        nombre: PropTypes.string,
        apellidoPaterno: PropTypes.string,
        apellidoMaterno: PropTypes.string,
        rut: PropTypes.any,
        vrut: PropTypes.string,
        email: PropTypes.string,
    }),
    isJefeLoading: PropTypes.bool,
};