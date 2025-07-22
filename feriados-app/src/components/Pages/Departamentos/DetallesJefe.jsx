import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { getFuncionarioLocalByRut } from '../../../services/funcionarioService';
import { updateJefeDeptoById } from '../../../services/departamentosService';

const DetallesJefe = ({ departamento, fetchDepartamentos }) => {

    const [enEdicion, setEnEdicion] = useState(false);
    const [nombreJefeEditado, setNombreJefeEditado] = useState('');
    const [rutJefeEditado, setRutJefeEditado] = useState('');
    const [emailJefeEditado, setEmailJefeEditado] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [rutCompleto, setRutCompleto] = useState('');

    useEffect(() => {
        if (departamento) {
            const rut = `${departamento.rutJefe}`;
            setNombreJefeEditado(departamento.nombreJefe || '');
            setEmailJefeEditado(departamento.email || '');
            setRutJefeEditado(rut);
        } else {
            setNombreJefeEditado('');
            setRutJefeEditado('');
        }
    }, [departamento]);

    const handleEditar = () => {
        setEnEdicion(true);
    };

    const handleGuardar = async () => {
        Swal.fire({
            title: '¿Está seguro de guardar los cambios?',
            text: "¡No podrá deshacer esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateJefeDeptoById(departamento.id, rutJefeEditado);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Jefe de departamento actualizado!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    fetchDepartamentos();
                    setEnEdicion(false);
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: error.response.data?.mensaje,
                        text: error.response.data?.detalle
                    });
                }
            }
        });
    };

    const handlerOnBlurRut = async () => {
        const input = rutCompleto.replace(/\./g, '').replace('-', '').toUpperCase();

        if (input.length < 2) {
            setNombreJefeEditado('');
            setRutJefeEditado('');
            setEmailJefeEditado('');
            setDisabled(true);
            return;
        }

        const cuerpo = input.slice(0, -1);
        const dv = input.slice(-1);

        try {
            const result = await getFuncionarioLocalByRut(cuerpo + dv);
            setNombreJefeEditado(result.nombre);
            setRutJefeEditado(cuerpo);
            setEmailJefeEditado(result.email);
            setDisabled(false);
        } catch (error) {
            setDisabled(true);
            Swal.fire({
                icon: 'error',
                title: error.response?.data?.mensaje || 'Error',
                text: error.response?.data?.detalle || 'No se pudo obtener el funcionario'
            });
        }
    };

    const handleCancelar = () => {
        setEnEdicion(false);
        setDisabled(false);
        setNombreJefeEditado(departamento.nombreJefe || '');
        setRutJefeEditado(departamento.rutJefe || '');
        setEmailJefeEditado(departamento.email || '');
    };

    const handleChangeRut = (event) => {
        const input = event.target.value.toUpperCase();
        setRutCompleto(input);
        setDisabled(false);
    };

    useEffect(() => {
        if (departamento) {
            const rut = `${departamento.rutJefe}`;
            const vrut = departamento.vrutJefe;
            setRutJefeEditado(rut);
            setNombreJefeEditado(departamento.nombreJefe || '');
            setEmailJefeEditado(departamento.email || '');
            setRutCompleto(`${rut}-${vrut}`);
        } else {
            setNombreJefeEditado('');
            setRutJefeEditado('');
            setRutCompleto('');
        }
    }, [departamento]);

    return (
        <div className="card p-3">
            {departamento ? (
                <>
                    {enEdicion ? (
                        <>
                            <div className="mb-2">
                                <label htmlFor="nombreJefe" className="form-label form-label-sm">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="nombreJefe"
                                    readOnly
                                    value={nombreJefeEditado}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="nombreJefe" className="form-label form-label-sm">Email</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="emailJefe"
                                    readOnly
                                    value={emailJefeEditado}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="rutJefe" className="form-label form-label-sm">RUT</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="rutJefe"
                                    onBlur={handlerOnBlurRut}
                                    onChange={handleChangeRut}
                                    value={rutCompleto}
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={handleGuardar}
                                    disabled={disabled}>Guardar</button>
                                <button className="btn btn-sm btn-secondary" onClick={handleCancelar}>Cancelar</button>
                            </div>
                        </>
                    ) : (
                        <>
                            {departamento.nombreJefe ? (
                                <>
                                    <p className="card-text mb-1"><strong>Nombre Jefe :</strong> {departamento.nombreJefe}</p>
                                    <p className="card-text mb-1"><strong>RUT:</strong> {departamento.rutJefe}-{departamento.vrutJefe}</p>
                                    <p className="card-text mb-1"><strong>Email:</strong> {departamento.email}</p>
                                </>
                            ) : (
                                <p className="card-text mb-1">Este departamento no tiene un jefe asignado.</p>
                            )}
                            <button className="btn btn-sm btn-primary" onClick={handleEditar}>Editar</button>
                        </>
                    )}
                </>
            ) : (
                <p className="card-text">Seleccione un departamento para ver los detalles del jefe.</p>
            )}
        </div>
    );
}

export default DetallesJefe;

DetallesJefe.propTypes = {
    fetchDepartamentos: PropTypes.func.isRequired,
    departamento: PropTypes.shape({
        id: PropTypes.any.isRequired,
        nombreJefe: PropTypes.string.isRequired,
        rutJefe: PropTypes.any.isRequired,
        vrutJefe: PropTypes.any.isRequired,
        email: PropTypes.any.isRequired,
        nivel: PropTypes.string.isRequired,
        dependencias: PropTypes.array,
        [PropTypes.string]: PropTypes.any,
    },
    ).isRequired,
};