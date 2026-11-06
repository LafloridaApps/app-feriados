const tiposPermiso = [

    { value: '', label: 'Seleccione el tipo' }, // New default option
    { value: 'FERIADO', label: 'Feriado' },
    { value: 'ADMINISTRATIVO', label: 'Administrativo' }

];

const jornadas = ['AM', 'PM'];

const CamposSolicitud = ({
    tipo,
    handlerTipo,
    fechaInicio,
    handlerFechaInicio,
    fechaFin,
    handlerFechaFin,
    jornadaInicio,
    setJornadaInicio,
    jornadaFin,
    setJornadaFin,
    minDateInicio,
    maxDateFin,
    jornadasBloqueadas
}) => {
    const renderSelect = (id, label, value, onChange, options, disabled = false) => (
        <div className="mb-4">
            <label htmlFor={id} className="form-label-premium">{label}</label>
            <select id={id} className="form-select form-select-premium" value={value} onChange={onChange} disabled={disabled}>
                {options.map(opt => (
                    <option key={opt.value || opt} value={opt.value || opt}>
                        {opt.label || opt}
                    </option>
                ))}
            </select>
        </div>
    );


    return (
        <>
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
                            jornadas,
                            jornadasBloqueadas
                        )}
                    </div>
                    <div className="col-md-6">
                        {renderSelect(
                            'jornadaFinal',
                            <><i className="bi bi-clock-history"></i> Jornada Final</>,
                            jornadaFin,
                            e => setJornadaFin(e.target.value),
                            jornadas,
                            jornadasBloqueadas
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CamposSolicitud;
