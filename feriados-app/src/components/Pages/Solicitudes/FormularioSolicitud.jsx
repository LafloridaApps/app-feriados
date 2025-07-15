// components/FormularioSolicitud.jsx
import { PropTypes } from 'prop-types';
import DetalleSolicitud from './DetalleSolicitud';
import ModalSubrogante from './Subrogancias/ModalSubrogante';
import { useEffect, useState } from 'react';
import { useIsJefe } from '../../../hooks/useIsJefe';
import { useFormularioSolicitud } from '../../../hooks/useFormularioSolicitud';

const tiposPermiso = [
     
    { value: 'FERIADO', label: 'Feriado' },
    { value: 'ADMINISTRATIVO', label: 'Administrativo' }
   
];

const jornadas = ['AM', 'PM'];

const FormularioSolicitud = ({ resumenAdm, resumenFer, detalleAdm, detalleFer }) => {
    const { verificar } = useIsJefe();
    const [esJefe, setEsJefe] = useState(false);
    const [esDirector, setEsDirector] = useState(false);

    console.log(esJefe);
    console.log(esDirector);


    const {
        tipo, setTipo,
        fechaInicio, handlerFechaInicio,
        fechaFin, handlerFechaFin,
        jornadaInicio, setJornadaInicio,
        jornadaFin, setJornadaFin,
        diasUsar, saldo,
        error, enviando,
        submitForm,
        mostrarModalSubrogante,
        handleSubroganteSelected,
        closeSubroganteModal,
        rut, depto
    } = useFormularioSolicitud({ resumenAdm, resumenFer, detalleAdm, detalleFer });


    useEffect(() => {
        if (depto && rut) {
            const codEx = depto.split('||')[0];
             verificar(codEx, rut)
                .then(response => {
                    setEsJefe(response.esJefe);
                    setEsDirector(response.esDirector);
                })
                .catch(() => setEsJefe(false));
        }
    }, [depto, rut, verificar]);

    const handleSubmit = (e) => submitForm(e, esJefe, esDirector);

    const renderSelect = (id, label, value, onChange, options) => (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
            <select id={id} className="form-select" value={value} onChange={onChange}>
                {options.map(opt => (
                    <option key={opt.value || opt} value={opt.value || opt}>
                        {opt.label || opt}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
       <div className='row'>
            <div className='col-md-6'>
                <div className="card shadow-sm">
                    <div className="card-header bg-secondary text-white">
                        <i className="bi bi-pen"></i> Nueva Solicitud
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {renderSelect(
                                'tipoPermiso',
                                <><i className="bi bi-question-circle"></i> Tipo de Permiso</>,
                                tipo,
                                (e) => setTipo(e.target.value),
                                tiposPermiso
                            )}

                            <div className="mb-3">
                                <label htmlFor="fechaInicio" className="form-label">
                                    <i className="bi bi-calendar-date"></i> Fecha Desde
                                </label>
                                <input
                                    id="fechaInicio"
                                    type="date"
                                    className="form-control"
                                    value={fechaInicio}
                                    onChange={handlerFechaInicio}
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div> 

                            <div className="mb-3">
                                <label htmlFor="fechaFin" className="form-label">
                                    <i className="bi bi-calendar-date"></i> Fecha Hasta
                                </label>
                                <input
                                    id="fechaFin"
                                    type="date"
                                    className="form-control"
                                    value={fechaFin}
                                    onChange={handlerFechaFin}
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>

                            {tipo === 'ADMINISTRATIVO' && (
                                <div className="row">
                                    <div className="col">
                                        {renderSelect(
                                            'jornadaInicio',
                                            'Jornada Inicio',
                                            jornadaInicio,
                                            e => setJornadaInicio(e.target.value),
                                            jornadas
                                        )}
                                    </div>
                                    <div className="col">
                                        {renderSelect(
                                            'jornadaFinal',
                                            'Jornada Final',
                                            jornadaFin,
                                            e => setJornadaFin(e.target.value),
                                            jornadas
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={enviando || Boolean(error)}
                                >
                                    Enviar Solicitud
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ModalSubrogante
                show={mostrarModalSubrogante}
                onClose={closeSubroganteModal}
                onSubroganteSelected={handleSubroganteSelected}
                depto={depto}
            />

            <div className='col-md-6'>
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
    resumenAdm: PropTypes.array,
    resumenFer: PropTypes.array,
    detalleAdm: PropTypes.array,
    detalleFer: PropTypes.array,
};

export default FormularioSolicitud;
