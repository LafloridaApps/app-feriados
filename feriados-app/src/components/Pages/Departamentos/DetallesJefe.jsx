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
                    const rutNumerico = rutCompleto.split('-')[0].replaceAll('.', '');
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
        const input = rutCompleto.replaceAll('.', '').replaceAll('-', '').toUpperCase();
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
        if (isJefeLoading) return (
            <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <output className="visually-hidden">Cargando...</output>
            </>
        );
        if (jefeSeleccionado) {
            return <>{[jefeSeleccionado.nombre, jefeSeleccionado.apellidoPaterno, jefeSeleccionado.apellidoMaterno].filter(Boolean).join(' ')}</>;
        }
        return <>{departamento.nombreJefe || 'No disponible'}</>;
    };

    const renderRut = () => {
        if (isJefeLoading) return (
            <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <output className="visually-hidden">Cargando...</output>
            </>
        );
        if (jefeSeleccionado) return <>{`${jefeSeleccionado.rut}-${jefeSeleccionado.vrut}`}</>;
        if (departamento.rutJefe) return <>{`${departamento.rutJefe}-${departamento.vrutJefe}`}</>;
        return <>{'No disponible'}</>;
    };

    const renderEmail = () => {
        if (isJefeLoading) return (
            <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <output className="visually-hidden">Cargando...</output>
            </>
        );
        return <>{(jefeSeleccionado?.email) || departamento.email || 'No disponible'}</>;
    };

    if (!departamento) {
        return (
            <div className="text-center py-5 text-muted">
                <i className="bi bi-building fs-1 mb-3 d-block text-secondary opacity-50"></i>
                <h5>Seleccione un departamento</h5>
                <p>Haga clic en un departamento del árbol organizativo para ver o editar sus detalles y su respectiva jefatura.</p>
            </div>
        );
    }

    const renderJefaturaContent = () => {
        if (enEdicion) {
            return (
                <div className="bg-light p-4 rounded border">
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label htmlFor="rutJefeInput" className="form-label text-muted small fw-bold text-uppercase">RUT del Funcionario</label>
                            <div className="input-group">
                                <input id="rutJefeInput" type="text" className="form-control" placeholder="Ej: 12345678-9" onChange={(e) => setRutCompleto(e.target.value)} value={rutCompleto} autoFocus />
                                <button className="btn btn-primary px-4" type="button" onClick={handleBuscarJefePorRut}>
                                    <i className="bi bi-search me-2"></i>Buscar
                                </button>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="nombreJefe" className="form-label text-muted small fw-bold text-uppercase">Nombre Encontrado</label>
                            <input id="nombreJefe" type="text" className="form-control bg-white" readOnly value={nombreJefeEditado} placeholder="El nombre aparecerá aquí..." />
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-4 justify-content-end">
                        <button className="btn btn-light border" onClick={handleCancelar}>Cancelar</button>
                        <button className="btn btn-success px-4" onClick={handleGuardarJefe} disabled={disabled || !nombreJefeEditado}>
                            <i className="bi bi-check-circle me-2"></i>Guardar
                        </button>
                    </div>
                </div>
            );
        }

        if (departamento.rutJefe) {
            return (
                <div className="d-flex align-items-center gap-4 mt-2 p-3 bg-light rounded border border-light">
                    <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '70px', height: '70px' }}>
                        <i className="bi bi-person-fill" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <div className="flex-grow-1">
                        <h5 className="mb-2 text-dark fw-semibold">{renderNombre()}</h5>
                        <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 text-muted small">
                            <span className="d-flex align-items-center gap-2">
                                <i className="bi bi-upc-scan text-primary"></i>
                                {renderRut()}
                            </span>
                            <span className="d-flex align-items-center gap-2">
                                <i className="bi bi-envelope text-primary"></i>
                                {renderEmail()}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center p-5 bg-light rounded border">
                <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-person-x fs-2"></i>
                </div>
                <h6 className="text-muted mb-1">Sin Jefatura Asignada</h6>
                <p className="text-muted small mb-0">Haga clic en <strong>Asignar</strong> para buscar y establecer un responsable para este departamento.</p>
            </div>
        );
    };

    return (
        <div className="d-flex flex-column gap-4">
            {/* Card: Jefatura */}
            <div className="bg-white p-4 rounded shadow-sm border">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 text-primary fw-bold d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-person-badge fs-5"></i>
                        </div>
                        Director / Jefatura
                    </h5>
                    {!enEdicion && (
                        <button className={`btn ${departamento.rutJefe ? 'btn-outline-primary btn-sm' : 'btn-primary btn-sm'}`} onClick={handleEditar}>
                            <i className={`bi ${departamento.rutJefe ? 'bi-pencil' : 'bi-plus-circle'} me-1`}></i>
                            {departamento.rutJefe ? 'Editar' : 'Asignar'}
                        </button>
                    )}
                </div>

                {renderJefaturaContent()}
            </div>

            {/* Card: Configuración */}
            <div className="bg-white p-4 rounded shadow-sm border">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-secondary bg-opacity-10 text-secondary rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-gear fs-5"></i>
                    </div>
                    <h5 className="mb-0 text-secondary fw-bold">Configuración Adicional</h5>
                </div>

                <div className="row align-items-end g-3">
                    <div className="col-md-9">
                        <label htmlFor="codigoExterno" className="form-label text-muted small fw-bold text-uppercase">Código Externo</label>
                        <input
                            type="text"
                            className="form-control"
                            id="codigoExterno"
                            placeholder="Ingrese código de referencia (ej: DEPTO-001)"
                            value={codigoExterno}
                            onChange={(e) => setCodigoExterno(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-outline-success w-100" onClick={handleGuardarCodigoExterno}>
                            <i className="bi bi-save me-2"></i>Guardar
                        </button>
                    </div>
                </div>
            </div>
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