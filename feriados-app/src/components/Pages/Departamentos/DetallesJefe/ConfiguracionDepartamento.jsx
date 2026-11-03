const ConfiguracionDepartamento = ({
    departamento,
    nombreDepartamento,
    setNombreDepartamento,
    codigoExterno,
    setCodigoExterno,
    setShowModalExterno,
    handleGuardarNombreDepartamento,
    handleGuardarCodigoExterno,
    handlerEliminar
}) => (
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
                            type="button"
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
                                type="button"
                                className="btn btn-outline-danger"
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
                            type="button"
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
);

export default ConfiguracionDepartamento;
