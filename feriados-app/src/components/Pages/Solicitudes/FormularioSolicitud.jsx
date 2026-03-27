import PropTypes from 'prop-types';
import DetalleSolicitud from './DetalleSolicitud';
import ModalSubrogante from './Subrogancias/ModalSubrogante';
import { useState } from 'react';
import { useEsJefe } from '../../../hooks/useEsJefe';
import { useFormularioSolicitud } from '../../../hooks/useFormularioSolicitud';
import ModalVerSubrogante from './Subrogancias/ModalVerSubrogante';

const tiposPermiso = [

    { value: '', label: 'Seleccione el tipo' }, // New default option
    { value: 'FERIADO', label: 'Feriado' },
    { value: 'ADMINISTRATIVO', label: 'Administrativo' }

];

const jornadas = ['AM', 'PM'];

const FormularioSolicitud = ({ resumenAdministrativo, resumenFeriados, detalleAdministrativo, detalleFeriados }) => {

    const [mostrarInfoSubrogante, setMostrarInfoSubrogante] = useState(false);

    const {
        tipo, handlerTipo,
        fechaInicio, handlerFechaInicio,
        fechaFin, handlerFechaFin,
        jornadaInicio, setJornadaInicio,
        jornadaFin, setJornadaFin,
        diasUsar, saldo,
        error, enviando,
        errorBloqueDiezDias,
        submitForm,
        mostrarModalSubrogante,
        handleSubroganteSelected,
        hanglerEliminarSubrogancia,
        closeSubroganteModal,
        rut, depto,
        subrogancia,
        minDateInicio,
        maxDateFin
    } = useFormularioSolicitud({ 
        resumenAdministrativo, 
        resumenFeriados, 
        detalleAdministrativo, 
        detalleFeriados 
    });

    const { esJefe, esDirector } = useEsJefe(depto, rut);

    const handleSubmit = (e) => submitForm(e, esJefe, esDirector);

    const renderSelect = (id, label, value, onChange, options) => (
        <div className="mb-4">
            <label htmlFor={id} className="form-label-premium">{label}</label>
            <select id={id} className="form-select form-select-premium" value={value} onChange={onChange}>
                {options.map(opt => (
                    <option key={opt.value || opt} value={opt.value || opt}>
                        {opt.label || opt}
                    </option>
                ))}
            </select>
        </div>
    );


    return (
        <div className='row g-4'>
            <div className='col-lg-6'>
                <div className="nueva-solicitud-container">
                    <div className="card-header-premium">
                        <i className="bi bi-pencil-square"></i>
                        <span>Nueva Solicitud</span>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-2">
                        {renderSelect(
                            'tipoPermiso',
                            <><i className="bi bi-info-circle"></i> Tipo de Permiso</>,
                            tipo,
                            handlerTipo,
                            tiposPermiso
                        )}

                        <div className="mb-4">
                            <label htmlFor="fechaInicio" className="form-label-premium">
                                <i className="bi bi-calendar-event"></i> Fecha Desde
                            </label>
                            <input
                                id="fechaInicio"
                                type="date"
                                className="form-control form-control-premium"
                                min={minDateInicio}
                                value={fechaInicio}
                                onChange={handlerFechaInicio}
                                onKeyDown={(e) => e.preventDefault()}
                                disabled={tipo === ''}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="fechaFin" className="form-label-premium">
                                <i className="bi bi-calendar-check"></i> Fecha Hasta
                            </label>
                            <input
                                id="fechaFin"
                                type="date"
                                className="form-control form-control-premium"
                                min={fechaInicio}
                                max={maxDateFin}
                                value={fechaFin}
                                onChange={handlerFechaFin}
                                onKeyDown={(e) => e.preventDefault()}
                                disabled={tipo === ''}
                            />
                        </div>
                        {tipo === 'ADMINISTRATIVO' && (
                            <div className="row g-3">
                                <div className="col-md-6">
                                    {renderSelect(
                                        'jornadaInicio',
                                        <><i className="bi bi-clock"></i> Jornada Inicio</>,
                                        jornadaInicio,
                                        e => setJornadaInicio(e.target.value),
                                        jornadas
                                    )}
                                </div>
                                <div className="col-md-6">
                                    {renderSelect(
                                        'jornadaFinal',
                                        <><i className="bi bi-clock-history"></i> Jornada Final</>,
                                        jornadaFin,
                                        e => setJornadaFin(e.target.value),
                                        jornadas
                                    )}
                                </div>
                            </div>
                        )}
                        {errorBloqueDiezDias && (
                            <div className="alert alert-warning border-0 shadow-sm d-flex align-items-start gap-3 mb-4" role="alert" style={{ background: '#fffbeb', color: '#92400e' }}>
                                <i className="bi bi-exclamation-triangle-fill fs-5 mt-1"></i>
                                <div className="small">
                                    <span className="fw-bold d-block mb-1">Validación Ley N°18.883</span>
                                    {errorBloqueDiezDias}
                                </div>
                            </div>
                        )}

                        <div className="mt-4 pt-2 border-top d-flex flex-column gap-3">
                            <button
                                type="submit"
                                className="btn btn-premium w-100"
                                disabled={enviando || Boolean(error) || !tipo}
                            >
                                {enviando ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Enviando...</>
                                ) : (
                                    <><i className="bi bi-send-fill me-2"></i>Enviar Solicitud</>
                                )}
                            </button>
                            {subrogancia && (
                                <div className="alert alert-info border-0 shadow-sm d-flex justify-content-between align-items-center mb-0" role="alert" style={{ background: '#f0f9ff', color: '#0369a1' }}>
                                    <div className="small">
                                        <i className="bi bi-person-check-fill me-2"></i> Subrogante seleccionado
                                    </div>
                                    <button
                                        type='button'
                                        className="btn btn-sm btn-link text-decoration-none fw-bold"
                                        onClick={() => setMostrarInfoSubrogante(true)}
                                    >
                                        VER DETALLES
                                    </button>
                                </div>
                            )}
                        </div>
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
