import Swal from 'sweetalert2';

const JefaturaDepartamento = ({
    departamento,
    enEdicion,
    nombreJefeEditado,
    rutCompleto,
    setRutCompleto,
    disabled,
    fotoJefe,
    setShowBusquedaModal,
    handleEditar,
    handleGuardarJefe,
    handleBuscarJefePorRut,
    handleCancelar
}) => {
    const renderFormularioJefatura = () => (
                <div className="jefatura-editor">
                    <div className="jefatura-editor-intro">
                        <span className="jefatura-editor-symbol"><i className="bi bi-person-plus" aria-hidden="true"></i></span>
                        <div>
                            <h6>{departamento.rutJefe ? 'Seleccione la nueva jefatura' : 'Asigne una jefatura'}</h6>
                            <p>Busque al funcionario y revise su nombre antes de guardar la asignación.</p>
                        </div>
                    </div>
                    <label htmlFor="rutJefeInput" className="form-label fw-semibold small">Buscar por RUT</label>
                    <div className="jefatura-search">
                        <input id="rutJefeInput" type="text" className="form-control" placeholder="Ej: 12345678-9"
                            aria-describedby="rutJefeAyuda" onChange={(e) => setRutCompleto(e.target.value)} value={rutCompleto} />
                        <button className="btn btn-outline-primary" type="button" onClick={handleBuscarJefePorRut}>
                            <i className="bi bi-search me-2" aria-hidden="true"></i>Buscar
                        </button>
                    </div>
                    <p id="rutJefeAyuda" className="jefatura-editor-help">Ingrese el RUT sin puntos y con guion.</p>
                    <div className="jefatura-search-alternative">
                        <span>¿No conoce el RUT?</span>
                        <button className="btn btn-link btn-sm" type="button" onClick={() => setShowBusquedaModal(true)}>
                            Buscar por nombre<i className="bi bi-arrow-right ms-2" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className={`jefatura-candidate ${nombreJefeEditado ? 'jefatura-candidate-found' : ''}`}>
                        <span className="jefatura-candidate-icon"><i className={`bi ${nombreJefeEditado ? 'bi-person-check' : 'bi-person'}`} aria-hidden="true"></i></span>
                        <div>
                            <label htmlFor="nombreJefe" className="jefatura-label">FUNCIONARIO SELECCIONADO</label>
                            <input id="nombreJefe" className="jefatura-candidate-name" readOnly value={nombreJefeEditado}
                                placeholder="Busque un funcionario para continuar" />
                        </div>
                    </div>
                    <div className="jefatura-editor-footer">
                        <button type="button" className="btn btn-light border" onClick={handleCancelar}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={() => handleGuardarJefe()} disabled={disabled || !nombreJefeEditado}>
                            <i className="bi bi-check2 me-2" aria-hidden="true"></i>Guardar asignación
                        </button>
                    </div>
                </div>
    );

    const renderJefaturaContent = () => {
        if (enEdicion) return renderFormularioJefatura();

        if (departamento.rutJefe) {
            return (
                <div className="jefatura-profile">
                    {fotoJefe ? (
                        <button
                            type="button"
                            className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden border-0 p-0 detalles-jefe-foto-btn"
                            onClick={() => {
                                void Swal.fire({
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
                    <div className="jefatura-identity">
                        <span className="jefatura-label">RESPONSABLE DEL DEPARTAMENTO</span>
                        <h5 className="jefatura-name">{departamento.nombreJefe || 'Nombre no disponible'}</h5>
                        <span className={`jefatura-status ${departamento.vigente === false ? 'jefatura-status-warning' : ''}`}>
                            <i className={`bi ${departamento.vigente === false ? 'bi-exclamation-circle' : 'bi-person-check'}`} aria-hidden="true"></i>
                            {departamento.vigente === false ? 'Contrato vencido' : 'Jefatura asignada'}
                        </span>

                    </div>
                    <dl className="jefatura-contact mb-0">
                        <div>
                            <dt><i className="bi bi-person-vcard me-2" aria-hidden="true"></i>RUT</dt>
                            <dd>{departamento.rutJefe && departamento.vrutJefe ? `${departamento.rutJefe}-${departamento.vrutJefe}` : 'No disponible'}</dd>
                        </div>
                        <div>
                            <dt><i className="bi bi-envelope me-2" aria-hidden="true"></i>Correo electrónico</dt>
                            <dd>{departamento.email || 'No disponible'}</dd>
                        </div>
                    </dl>
                </div>
            );
        }

        return (
            <div className="jefatura-unassigned text-center">
                <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 detalles-jefe-avatar-placeholder">
                    <i className="bi bi-person-x fs-2"></i>
                </div>
                <h6 className="text-muted mb-1">Este departamento aún no tiene jefatura</h6>
                <p className="text-muted small mb-0">Busque un funcionario por nombre o RUT para asignarlo como responsable.</p>
            </div>
        );
    };

    return (
        <div className="jefatura-card">
            <div className="jefatura-heading">
                <h5 className="mb-0 fw-semibold d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center detalles-jefe-icon-container">
                        <i className="bi bi-person-badge fs-5"></i>
                    </div>
                    Jefatura
                </h5>
                {!enEdicion && (
                    <div className="jefatura-actions">
                        {departamento.rutJefe && (
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleGuardarJefe(true)} title="Quitar jefatura">
                                <i className="bi bi-person-dash me-1"></i>Quitar asignación
                            </button>
                        )}
                        <button type="button" className={`btn ${departamento.rutJefe ? 'btn-outline-primary btn-sm' : 'btn-primary btn-sm'}`} onClick={handleEditar}>
                            <i className={`bi ${departamento.rutJefe ? 'bi-pencil' : 'bi-plus-circle'} me-1`}></i>{departamento.rutJefe ? 'Cambiar jefatura' : 'Asignar jefatura'}
                        </button>
                    </div>
                )}
            </div>

            {renderJefaturaContent()}
        </div>
    );
};

export default JefaturaDepartamento;
