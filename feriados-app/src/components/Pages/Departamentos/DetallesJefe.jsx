import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { getFuncionarioLocalByRut } from '../../../services/funcionarioService';
import { updateJefeDeptoById, updateNombreDeptoById, updateCodigoExterno, deleteCodigoExternoByIdDepto } from '../../../services/departamentosService';
import { validarRut } from '../../../services/utils';
import ModalDepartamentosExternos from './ModalDepartamentosExternos';
import { getFotoFuncionario } from '../../../services/fotoService';
import ModalBuscarPorNombre from '../../Common/ModalBuscarPorNombre';
import { FaSearch } from 'react-icons/fa';
import './DetallesJefe.css';

const DetallesJefe = ({ departamento, fetchDepartamentos, setDepartamentoSeleccionado }) => {

    const [enEdicion, setEnEdicion] = useState(false);
    const [nombreJefeEditado, setNombreJefeEditado] = useState('');
    const [rutCompleto, setRutCompleto] = useState('');
    const [codigoExterno, setCodigoExterno] = useState('');
    const [nombreDepartamento, setNombreDepartamento] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [showModalExterno, setShowModalExterno] = useState(false);
    const [fotoJefe, setFotoJefe] = useState(null);
    const [showBusquedaModal, setShowBusquedaModal] = useState(false);

    useEffect(() => {
        if (departamento) {
            setNombreJefeEditado(departamento.nombreJefe || '');
            setRutCompleto((departamento.rutJefe && departamento.vrutJefe) ? `${departamento.rutJefe}-${departamento.vrutJefe}` : '');
            setCodigoExterno(departamento.codigoExterno || '');
            setNombreDepartamento(departamento.nombre || '');

            if (departamento.rutJefe) {
                cargarFoto(departamento.rutJefe);
            } else {
                setFotoJefe(null);
            }
        } else {
            setNombreJefeEditado('');
            setRutCompleto('');
            setCodigoExterno('');
            setNombreDepartamento('');
            setFotoJefe(null);
        }
    }, [departamento]);

    const cargarFoto = async (rut) => {
        try {
            const base64Str = await getFotoFuncionario(rut);
            if (base64Str) {
                setFotoJefe(base64Str.startsWith('data:image') ? base64Str : `data:image/jpeg;base64,${base64Str}`);
            } else {
                setFotoJefe(null);
            }
        } catch (error) {
            console.error('Error al cargar la foto:', error);
            setFotoJefe(null);
        }
    };

    const handleEditar = () => {
        setEnEdicion(true);
    };

    const handleGuardarJefe = async (rutNumericoParaGuardar = null, vrutParaGuardar = null, nombreJefeParaGuardar = '', esRemocion = false) => {
        const accion = esRemocion ? 'dejar este departamento sin jefe' : 'guardar el jefe';
        const txtBoton = esRemocion ? 'quitar jefe' : 'guardar';
        const colorBoton = esRemocion ? '#d33' : '#3085d6';

        const result = await Swal.fire({
            title: `¿Está seguro de ${accion}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Sí, ${txtBoton}`,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: colorBoton,
        });

        if (!result.isConfirmed) return;

        try {
            let rutNumericoFinal = rutNumericoParaGuardar;

            // Si no pasamos parámetros explícitos (flujo normal de edición), leemos del estado
            if (!esRemocion && rutNumericoParaGuardar === null) {
                const partesRut = rutCompleto.split('-');
                rutNumericoFinal = partesRut[0].replaceAll('.', '');
            }

            const resultApi = await updateJefeDeptoById(departamento.id, esRemocion ? 0 : rutNumericoFinal);

            if (setDepartamentoSeleccionado) {
                setDepartamentoSeleccionado(null);
            }

            const mensajeExito = esRemocion ? 'Departamento actualizado sin jefe.' : 'Jefe guardado correctamente.';
            Swal.fire('¡Éxito!', resultApi.message || mensajeExito, 'success');

            fetchDepartamentos();
            setEnEdicion(false);
        } catch (error) {
            const accionError = esRemocion ? 'quitar al jefe' : 'guardar';
            Swal.fire('Error', error.response?.data?.detalle || `No se pudo ${accionError}.`, 'error');
        }
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
                    await updateCodigoExterno(departamento.id, codigoExterno);

                    if (setDepartamentoSeleccionado) {
                        setDepartamentoSeleccionado(null);
                    }

                    Swal.fire('¡Guardado!', result.message, 'success');
                    fetchDepartamentos();
                } catch (error) {
                    console.log(error);
                    const errorMsg = error.response?.data?.message || error.response?.data?.detalle || 'No se pudo guardar.';
                    Swal.fire('Error', errorMsg, 'error');
                }
            }
        });
    };

    const handleGuardarNombreDepartamento = () => {
        Swal.fire({
            title: '¿Está seguro de actualizar el nombre del departamento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateNombreDeptoById(departamento.id, nombreDepartamento);

                    if (setDepartamentoSeleccionado) {
                        setDepartamentoSeleccionado(null);
                    }

                    Swal.fire('¡Guardado!', 'El nombre del departamento ha sido actualizado.', 'success');
                    fetchDepartamentos();
                } catch (error) {
                    Swal.fire('Error', error.response?.data?.detalle || 'No se pudo actualizar el nombre del departamento.', 'error');
                }
            } else {
                setNombreDepartamento(departamento.nombre || '');
            }
        });
    };

    const handleBuscarJefePorRut = async () => {
        if (!rutCompleto) return;

        if (rutCompleto.includes('.')) {
            Swal.fire('Error', 'El RUT debe ser ingresado sin puntos.', 'error');
            return;
        }

        const partes = rutCompleto.split('-');
        if (partes.length !== 2 || partes[1].length !== 1) {
            Swal.fire('Error', 'El RUT debe contener un guión antes del dígito verificador.', 'error');
            return;
        }

        const rutLimpio = rutCompleto.replaceAll('-', '').toUpperCase();

        if (!validarRut(rutLimpio)) {
            Swal.fire('Error', 'El RUT ingresado no es válido. Verifique el formato y dígito verificador.', 'error');
            setNombreJefeEditado('');
            setDisabled(true);
            return;
        }

        const cuerpo = partes[0];

        try {
            const { data } = await getFuncionarioLocalByRut(cuerpo);
            const nombreCompleto = [data.nombre, data.apellidoPaterno, data.apellidoMaterno].filter(Boolean).join(' ');
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
        if (departamento) {
            setNombreJefeEditado(departamento.nombreJefe || '');
            setRutCompleto((departamento.rutJefe && departamento.vrutJefe) ? `${departamento.rutJefe}-${departamento.vrutJefe}` : '');
        }
    };

    const handlerEliminar = () => {
        Swal.fire({
            title: '¿Está seguro?',
            text: 'Se eliminará el código externo del departamento.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const result = deleteCodigoExternoByIdDepto(departamento.id)
                    .then(() => {
                        Swal.fire('Eliminado', result.message, 'success');
                        if (setDepartamentoSeleccionado) {
                            setDepartamentoSeleccionado(null);
                        }
                    })
                    .catch((error) => {
                        Swal.fire('Error', error.response?.data?.detalle || 'No se pudo eliminar el código externo.', 'error');
                    });
            }
        });
    }

    // --- Renderizado de campos --- //
    const renderNombre = () => {
        return <>{departamento.nombreJefe || 'No disponible'}</>;
    };

    const renderRut = () => {
        if (departamento.rutJefe && departamento.vrutJefe) return <>{`${departamento.rutJefe}-${departamento.vrutJefe}`}</>;
        return <>{'No disponible'}</>;
    };

    const renderEmail = () => {
        return <>{departamento.email || 'No disponible'}</>;
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
                                <button className="btn btn-outline-secondary" type="button" onClick={() => setShowBusquedaModal(true)} title="Buscar por nombre">
                                    <FaSearch className="me-1" /> Buscar Nombre
                                </button>
                                <button className="btn btn-primary px-4" type="button" onClick={handleBuscarJefePorRut}>
                                    Buscar RUT
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
                        <button className="btn btn-success px-4" onClick={() => handleGuardarJefe()} disabled={disabled || !nombreJefeEditado}>
                            <i className="bi bi-check-circle me-2"></i>Guardar
                        </button>
                    </div>
                </div>
            );
        }

        if (departamento.rutJefe) {
            return (
                <div className="d-flex align-items-center gap-4 mt-2 p-3 bg-light rounded border border-light">
                    {fotoJefe ? (
                        <button
                            type="button"
                            className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden border-0 p-0 detalles-jefe-foto-btn"
                            onClick={() => {
                                Swal.fire({
                                    imageUrl: fotoJefe,
                                    imageAlt: 'Foto Jefatura',
                                    showConfirmButton: false,
                                    showCloseButton: true,
                                    customClass: { image: 'img-fluid rounded' }
                                });
                            }}
                            title="Ver foto"
                        >
                            <img src={fotoJefe} alt="Foto Jefatura" className="detalles-jefe-foto-img" />
                        </button>
                    ) : (
                        <div
                            className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden detalles-jefe-foto-default"
                        >
                            <i className="bi bi-person-fill detalles-jefe-icon-large"></i>
                        </div>
                    )}
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
                <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 detalles-jefe-avatar-placeholder">
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
                        <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center detalles-jefe-icon-container">
                            <i className="bi bi-person-badge fs-5"></i>
                        </div>
                        Director / Jefatura
                    </h5>
                    {!enEdicion && (
                        <div className="d-flex gap-2">
                            {departamento.rutJefe && (
                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleGuardarJefe(null, null, null, true)} title="Quitar jefatura">
                                    <i className="bi bi-person-dash me-1"></i>Dejar sin jefe
                                </button>
                            )}
                            <button className={`btn ${departamento.rutJefe ? 'btn-outline-primary btn-sm' : 'btn-primary btn-sm'}`} onClick={handleEditar}>
                                <i className={`bi ${departamento.rutJefe ? 'bi-pencil' : 'bi-plus-circle'} me-1`}></i>{departamento.rutJefe ? 'Editar' : 'Asignar'}
                            </button>
                        </div>
                    )}
                </div>

                {renderJefaturaContent()}
            </div>

            {/* Card: Configuración */}
            <div className="bg-white p-4 rounded shadow-sm border">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-secondary bg-opacity-10 text-secondary rounded d-flex align-items-center justify-content-center detalles-jefe-icon-container">
                        <i className="bi bi-gear fs-5"></i>
                    </div>
                    <h5 className="mb-0 text-secondary fw-bold">Configuración Adicional</h5>
                </div>

                <div className="row g-4 mb-3">
                    {/* Sección Nombre del Departamento */}
                    <div className="col-12">
                        <div className="p-3 border rounded bg-light">
                            <label htmlFor="nombreDepartamento" className="form-label text-muted small fw-bold text-uppercase mb-2">
                                <i className="bi bi-tag me-2"></i>Nombre del Departamento
                            </label>
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombreDepartamento"
                                    placeholder="Ingrese nombre del departamento"
                                    value={nombreDepartamento}
                                    onChange={(e) => setNombreDepartamento(e.target.value)}
                                />
                                <button
                                    className="btn btn-outline-success text-nowrap px-4"
                                    onClick={handleGuardarNombreDepartamento}
                                    disabled={!nombreDepartamento || nombreDepartamento === (departamento.nombre || '')}
                                >
                                    <i className="bi bi-save me-2"></i>Guardar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sección Código Externo */}
                    <div className="col-12">
                        <div className="p-3 border rounded bg-light">
                            <label htmlFor="codigoExterno" className="form-label text-muted small fw-bold text-uppercase mb-2">
                                <i className="bi bi-hash me-2"></i>Código Externo
                            </label>
                            <div className="d-flex gap-2">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="codigoExterno"
                                        placeholder="Ingrese código de referencia (ej: 10000000)"
                                        value={codigoExterno}
                                        onChange={(e) => setCodigoExterno(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-outline-danger"
                                        type="button"
                                        onClick={() => handlerEliminar()}
                                        title="Eliminar código externo"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setCodigoExterno(departamento.codigoExterno || '')}
                                        disabled={codigoExterno === (departamento.codigoExterno || '')}
                                        title="Cancelar cambios y volver al código original"
                                    >
                                        <i className="bi bi-arrow-counterclockwise"></i>
                                    </button>
                                    <button className="btn btn-outline-primary" type="button" onClick={() => setShowModalExterno(true)}>
                                        <i className="bi bi-search me-1"></i>Buscar
                                    </button>
                                </div>
                                <button
                                    className="btn btn-outline-success text-nowrap px-4"
                                    onClick={handleGuardarCodigoExterno}
                                >
                                    <i className="bi bi-save me-2"></i>Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalDepartamentosExternos
                show={showModalExterno}
                onHide={() => setShowModalExterno(false)}
                onSelect={(d) => setCodigoExterno(d.depto)}
            />

            <ModalBuscarPorNombre
                show={showBusquedaModal}
                onClose={() => setShowBusquedaModal(false)}
                onSelected={(func) => {
                    setRutCompleto(`${func.rut}-${func.vrut}`);
                    setNombreJefeEditado(func.nombreCompleto);
                    setDisabled(false);
                }}
            />
        </div>
    );
}

export default DetallesJefe;

DetallesJefe.propTypes = {
    fetchDepartamentos: PropTypes.func.isRequired,
    departamento: PropTypes.shape({
        id: PropTypes.any.isRequired,
        nombre: PropTypes.string,
        nombreJefe: PropTypes.string,
        rutJefe: PropTypes.any,
        vrutJefe: PropTypes.any,
        email: PropTypes.any,
        codigoExterno: PropTypes.string,
    }),
    setDepartamentoSeleccionado: PropTypes.func
};