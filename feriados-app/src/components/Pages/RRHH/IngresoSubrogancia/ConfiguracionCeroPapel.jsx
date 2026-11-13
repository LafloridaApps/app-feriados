import { useEffect, useRef, useState } from 'react';
import { FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useConfiguracionCeroPapel } from './useConfiguracionCeroPapel';
import { usePermisoCeroPapel } from './usePermisoCeroPapel';

const indicadorIntegracion = (habilitada) => {
    if (habilitada === true) return { texto: 'Integración con Cero Papel activada', clase: 'text-success' };
    if (habilitada === false) return { texto: 'Integración con Cero Papel desactivada', clase: 'text-secondary' };
    return { texto: 'Estado de integración no disponible', clase: 'text-muted' };
};

const ConfiguracionCeroPapel = () => {
    const {
        habilitada, configuracion, valoresIniciales, url, setUrl, usuario, setUsuario, clave, setClave,
        ocupado, error, aviso, actualizar, guardarParametros, alternarActivacion, revelarClave,
    } = useConfiguracionCeroPapel();
    const claveConfigurada = configuracion?.claveConfigurada ?? valoresIniciales?.claveConfigurada ?? false;
    const autorizado = usePermisoCeroPapel();
    const [mostrarClave, setMostrarClave] = useState(false);
    const [mostrar, setMostrar] = useState(false);
    const dialogo = useRef(null);

    useEffect(() => {
        const elemento = dialogo.current;
        if (!elemento) return;
        if (mostrar && !elemento.open) elemento.showModal();
        if (!mostrar && elemento.open) elemento.close();
    }, [mostrar]);

    const cerrar = () => {
        if (ocupado) return;
        setClave('');
        setMostrarClave(false);
        setMostrar(false);
    };

    const abrir = async () => {
        setMostrar(true);
        await actualizar();
    };

    const alternarClave = async () => {
        if (mostrarClave) {
            setMostrarClave(false);
            return;
        }
        if (clave) {
            setMostrarClave(true);
            return;
        }
        setMostrarClave(await revelarClave());
    };

    const indicador = indicadorIntegracion(habilitada);

    return (
        <>
            <div className="d-flex flex-column align-items-md-end gap-2">
                <output className={`small ${indicador.clase}`} aria-live="polite">{indicador.texto}</output>
                {autorizado && (
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={abrir}>
                        <FaCog className="me-2" /> Configurar Cero Papel
                    </button>
                )}
            </div>
            {autorizado && <dialog ref={dialogo} className="ceropapel-config-dialog border-0 rounded shadow p-0"
                aria-labelledby="titulo-configurar-ceropapel" onCancel={e => { e.preventDefault(); cerrar(); }}>
                <div className="modal-content border-0">
                    <div className="modal-header">
                        <h5 id="titulo-configurar-ceropapel" className="modal-title">Configuración de Cero Papel</h5>
                        <button type="button" className="btn-close" aria-label="Cerrar configuración"
                            onClick={cerrar} disabled={ocupado} />
                    </div>
                    <div className="modal-body">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                            <div>
                                <h6 className="mb-1">Envío de subrogancias</h6>
                                <small className="text-muted">Aplica a las solicitudes y al ingreso manual.</small>
                            </div>
                            <button type="button" className={habilitada ? 'btn btn-outline-danger' : 'btn btn-success'}
                                onClick={alternarActivacion} disabled={ocupado || !configuracion}>
                                {habilitada ? 'Desactivar envío' : 'Activar envío'}
                            </button>
                        </div>
                        <p className="small text-muted">
                            Las subrogancias siempre se guardan en este sistema. Esta opción controla únicamente
                            su envío a Cero Papel. No modifica ni cancela las que ya fueron enviadas.
                        </p>
                        {ocupado && <output className="small d-block mb-3">Procesando configuración…</output>}
                        {error && <div className="alert alert-warning" role="alert">{error}</div>}
                        {aviso && <output className="alert alert-success d-block">{aviso}</output>}
                        <form id="form-configurar-ceropapel" onSubmit={guardarParametros} className="row g-3">
                            <div className="col-12">
                                <label className="form-label" htmlFor="ceropapel-url">URL de la API</label>
                                <input id="ceropapel-url" type="url" className="form-control" value={url}
                                    onChange={e => setUrl(e.target.value)} required maxLength={2048}
                                    disabled={ocupado || !configuracion} placeholder="https://institucion.ceropapel.cl/inter/" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="ceropapel-usuario">Usuario de integración</label>
                                <input id="ceropapel-usuario" className="form-control" value={usuario}
                                    onChange={e => setUsuario(e.target.value)} required maxLength={100}
                                    disabled={ocupado || !configuracion} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="ceropapel-clave">Clave</label>
                                <div className="input-group">
                                    <input id="ceropapel-clave" type={mostrarClave ? 'text' : 'password'}
                                        autoComplete="new-password" className="form-control" value={clave}
                                        onChange={e => setClave(e.target.value)} maxLength={1900}
                                        placeholder={claveConfigurada ? '••••••••' : ''}
                                        disabled={ocupado || !configuracion} aria-describedby="ceropapel-clave-ayuda" />
                                    <button type="button" className="btn btn-outline-secondary"
                                        onClick={alternarClave} disabled={ocupado || !configuracion}
                                        aria-label={mostrarClave ? 'Ocultar clave' : 'Mostrar clave'} aria-pressed={mostrarClave}>
                                        {mostrarClave ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <small id="ceropapel-clave-ayuda" className="text-muted">
                                    {claveConfigurada
                                        ? 'Deje vacío para conservar la clave guardada.'
                                        : 'Ingrese la clave de integración.'}
                                </small>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" onClick={actualizar} disabled={ocupado}>
                            Actualizar
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={cerrar} disabled={ocupado}>Cerrar</button>
                        <button className="btn btn-primary" type="submit" form="form-configurar-ceropapel"
                            disabled={ocupado || !configuracion}>Guardar conexión</button>
                    </div>
                </div>
            </dialog>}
        </>
    );
};

export default ConfiguracionCeroPapel;
