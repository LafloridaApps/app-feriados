import PropTypes from 'prop-types';
import CamposSolicitud from './FormularioSolicitud/CamposSolicitud';
import AccionesFormularioSolicitud from './FormularioSolicitud/AccionesFormularioSolicitud';
import DetalleSolicitud from './DetalleSolicitud';
import ModalSubrogante from './Subrogancias/ModalSubrogante';
import { useState, useContext } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { useEsJefe } from '../../../hooks/useEsJefe';
import { useFormularioSolicitud } from '../../../hooks/useFormularioSolicitud';
import ModalVerSubrogante from './Subrogancias/ModalVerSubrogante';

const FormularioSolicitud = ({ resumenAdministrativo, resumenFeriados, detalleAdministrativo, detalleFeriados }) => {

    const funcionario = useContext(UsuarioContext);
    const [mostrarInfoSubrogante, setMostrarInfoSubrogante] = useState(false);

    const formulario = useFormularioSolicitud({
        resumenAdministrativo,
        resumenFeriados,
        detalleAdministrativo,
        detalleFeriados
    });
    const {
        tipo, fechaInicio, fechaFin, diasUsar, saldo,
        submitForm, mostrarModalSubrogante, handleSubroganteSelected,
        hanglerEliminarSubrogancia, closeSubroganteModal,
        rut, depto, subrogancia
    } = formulario;

    const { esJefe, esDirector } = useEsJefe(depto, rut);

    const handleSubmit = (e) => submitForm(e, esJefe, esDirector);

    if (funcionario?.configuracionDepartamento?.estado !== 'VALIDADO' || !funcionario?.codDepto) {
        return <div className="alert alert-warning" role="alert">No puedes crear solicitudes hasta validar la asociación de tu departamento. Reintenta la validación o contacta a un administrador.</div>;
    }

    return (
        <div className='row g-4'>
            <div className='col-lg-6'>
                <div className="nueva-solicitud-container">
                    <div className="card-header-premium">
                        <i className="bi bi-pencil-square"></i>
                        <span>Nueva Solicitud</span>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-2">
                        <CamposSolicitud {...formulario} />
                        <AccionesFormularioSolicitud
                            {...formulario}
                            setMostrarInfoSubrogante={setMostrarInfoSubrogante}
                        />
                    </form>
                </div>
            </div>

            <ModalVerSubrogante
                show={mostrarInfoSubrogante}
                onClose={() => setMostrarInfoSubrogante(false)}
                subrogante={subrogancia}
                onEliminar={hanglerEliminarSubrogancia}
            />

            <ModalSubrogante
                show={mostrarModalSubrogante}
                onClose={closeSubroganteModal}
                onSubroganteSelected={handleSubroganteSelected}
                rutFuncionario={rut}
                deptoFuncionario={depto}
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
            />

            <div className='col-lg-6'>
                <DetalleSolicitud
                    fechaInicio={fechaInicio}
                    fechaFin={fechaFin}
                    tipo={tipo}
                    depto={depto}
                    diasUsar={diasUsar}
                    saldo={saldo}
                />
            </div>
        </div>
    );
};

FormularioSolicitud.propTypes = {
    resumenAdministrativo: PropTypes.object,
    resumenFeriados: PropTypes.object,
    detalleAdministrativo: PropTypes.array,
    detalleFeriados: PropTypes.array,
};


export default FormularioSolicitud;
