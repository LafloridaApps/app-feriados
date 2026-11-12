import { useState } from 'react';

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
}) => {
    const [editandoNombre, setEditandoNombre] = useState(false);
    const [editandoCodigo, setEditandoCodigo] = useState(false);

    const cancelarNombre = () => {
        setNombreDepartamento(departamento.nombre || '');
        setEditandoNombre(false);
    };
    const cancelarCodigo = () => {
        setCodigoExterno(departamento.codigoExterno || '');
        setShowModalExterno(false);
        setEditandoCodigo(false);
    };

    return (
    <div className="configuracion-departamento">
        <div className="configuracion-heading">
            <div className="bg-secondary bg-opacity-10 text-secondary rounded d-flex align-items-center justify-content-center detalles-jefe-icon-container">
                <i className="bi bi-gear fs-5"></i>
            </div>
            <h5 className="mb-0 fw-semibold">Configuración adicional</h5>
        </div>

        <div className="configuracion-fields">
            {/* Sección Nombre del Departamento */}
            <div className="col-12">
                <div className="configuracion-field">
                    <label htmlFor="nombreDepartamento" className="form-label fw-semibold mb-2">
                        <i className="bi bi-tag me-2"></i>Nombre del Departamento
                    </label>
                    <p className="configuracion-help">Defina el nombre que se mostrará en la estructura organizacional.</p>
                    <div className="configuracion-controls">
                        <input
                            type="text"
                            className="form-control"
                            id="nombreDepartamento"
                            placeholder="Ingrese nombre del departamento"
                            readOnly={!editandoNombre}
                            value={editandoNombre ? nombreDepartamento : departamento.nombre || ''}
                            onChange={(e) => setNombreDepartamento(e.target.value)}
                        />
                        {editandoNombre ? <>
                            <button type="button" className="btn btn-light border" onClick={cancelarNombre}>Cancelar</button>
                            <button type="button" className="btn btn-outline-primary text-nowrap"
                                onClick={handleGuardarNombreDepartamento}
                                disabled={!nombreDepartamento.trim() || nombreDepartamento === (departamento.nombre || '')}>
                                <i className="bi bi-save me-2" aria-hidden="true"></i>Guardar
                            </button>
                        </> : <button type="button" className="btn btn-outline-primary text-nowrap" onClick={() => {
                            setNombreDepartamento(departamento.nombre || '');
                            setEditandoNombre(true);
                        }}><i className="bi bi-pencil me-2" aria-hidden="true"></i>Editar</button>}

                    </div>
                </div>
            </div>

            {/* Sección Código Externo */}
            <div className="col-12">
                <div className="configuracion-field">
                    <label htmlFor="codigoExterno" className="form-label fw-semibold mb-2">
                        <i className="bi bi-hash me-2"></i>Código Externo
                    </label>
                    <p className="configuracion-help">Vincule esta unidad con su referencia en el sistema externo.</p>
                    <div className="configuracion-controls">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                id="codigoExterno"
                                placeholder="Ej: 10000000"
                                readOnly={!editandoCodigo}
                                value={editandoCodigo ? codigoExterno : departamento.codigoExterno || ''}
                                onChange={(e) => setCodigoExterno(e.target.value)}
                            />
                            {editandoCodigo && <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => handlerEliminar()}
                                title="Eliminar código externo"
                                aria-label="Eliminar código externo"
                            >
                                <i className="bi bi-trash"></i>
                            </button>}
                            {editandoCodigo && <button className="btn btn-outline-primary" type="button" onClick={() => setShowModalExterno(true)}>
                                <i className="bi bi-search me-1"></i>Buscar
                            </button>}
                        </div>
                        {editandoCodigo ? <>
                            <button type="button" className="btn btn-light border" onClick={cancelarCodigo}>Cancelar</button>
                            <button type="button" className="btn btn-outline-primary text-nowrap"
                                onClick={handleGuardarCodigoExterno}
                                disabled={!codigoExterno.trim() || codigoExterno === (departamento.codigoExterno || '')}>
                                <i className="bi bi-save me-2" aria-hidden="true"></i>Guardar
                            </button>
                        </> : <button type="button" className="btn btn-outline-primary text-nowrap" onClick={() => {
                            setCodigoExterno(departamento.codigoExterno || '');
                            setEditandoCodigo(true);
                        }}><i className="bi bi-pencil me-2" aria-hidden="true"></i>Editar</button>}

                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ConfiguracionDepartamento;
