const AccionesFormularioSolicitud = ({
    errorBloqueDiezDias,
    enviando,
    error,
    tipo,
    subrogancia,
    setMostrarInfoSubrogante
}) => (
    <>
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
                    <><output className="spinner-border spinner-border-sm me-2"></output>Enviando...</>
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
    </>
);

export default AccionesFormularioSolicitud;
