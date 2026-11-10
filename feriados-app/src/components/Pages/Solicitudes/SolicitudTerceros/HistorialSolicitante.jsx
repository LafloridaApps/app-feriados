import { useEffect, useRef, useState } from 'react';
import { obtenerHistorialSolicitante } from '../../../../services/solicitudTercerosService';
import { formatFecha } from '../../../../services/utils';
import DetalleMiSolicitud from '../../MisSolicitudes/DetalleMiSolicitud';
import { tieneDocumentoAprobado, normalizarUrlPdf } from './historialSolicitudUtils';
import '../../MisSolicitudes/MisSolicitudes.css';
import './HistorialSolicitante.css';

function HistorialSolicitante({ rutGestor, solicitante }) {
    const dialogo = useRef(null);
    const [abierto, setAbierto] = useState(false);
    const [pagina, setPagina] = useState(0);
    const [revision, setRevision] = useState(0);
    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [descargando, setDescargando] = useState(null);
    const [errorDescarga, setErrorDescarga] = useState('');
    const rut = solicitante.rut;

    useEffect(() => {
        if (!abierto) return;
        let vigente = true;
        setCargando(true);
        setError('');
        setErrorDescarga('');
        obtenerHistorialSolicitante(rutGestor, rut, pagina)
            .then(data => { if (vigente) setResultado(data); })
            .catch(err => {
                if (vigente) setError(err.response?.data?.message || 'No fue posible consultar las solicitudes. Intenta nuevamente.');
            })
            .finally(() => { if (vigente) setCargando(false); });
        return () => { vigente = false; };
    }, [abierto, rutGestor, rut, pagina, revision]);

    useEffect(() => {
        if (!abierto) return;
        const anterior = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = anterior; };
    }, [abierto]);

    const abrir = () => {
        setPagina(0);
        setResultado(null);
        setAbierto(true);
        dialogo.current.showModal();
    };
    const cerrar = () => dialogo.current.close();
    const descargarPdf = async (solicitud) => {
        setDescargando(solicitud.id);
        setErrorDescarga('');
        try {
            const response = await fetch(normalizarUrlPdf(solicitud.urlPdf));
            if (!response.ok) throw new Error('No se pudo recuperar el documento.');
            const blob = await response.blob();
            if (!(await blob.slice(0, 5).text()).startsWith('%PDF-')) throw new Error('La respuesta no contiene un PDF válido.');
            const url = URL.createObjectURL(blob);
            const enlace = document.createElement('a');
            enlace.href = url;
            enlace.download = `solicitud-${solicitud.id}.pdf`;
            document.body.append(enlace);
            enlace.click();
            enlace.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch {
            setErrorDescarga(`No fue posible descargar el PDF de la solicitud #${solicitud.id}. Puedes abrirlo con “Ver PDF” y guardarlo desde el visor.`);
        } finally {
            setDescargando(null);
        }
    };

    const solicitudes = resultado?.solicitudes || [];
    return (
        <div className="mb-4">
            <button type="button" className="btn btn-outline-primary" onClick={abrir}>
                <i className="bi bi-clock-history me-2" aria-hidden="true" />Historial de solicitudes y documentos
            </button>
            <dialog ref={dialogo} className="historial-solicitante-modal" aria-labelledby="titulo-historial"
                onClose={() => setAbierto(false)}>
                <div className="historial-solicitante-header">
                    <div>
                        <h3 id="titulo-historial" className="h5 mb-1">Historial de solicitudes</h3>
                        <p className="text-muted small mb-0">{solicitante.nombreCompleto || solicitante.nombre} · RUT: {rut}{solicitante.vrut ? `-${solicitante.vrut}` : ''}</p>
                    </div>
                    <button type="button" className="btn-close" aria-label="Cerrar historial" onClick={cerrar} autoFocus />
                </div>
                <div className="historial-solicitante-body" aria-busy={cargando}>
                    <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                        <p className="text-muted small mb-0">Revisa solicitudes anteriores y recupera sus documentos aprobados.</p>
                        <button type="button" className="btn btn-outline-primary btn-sm" disabled={cargando}
                            onClick={() => setRevision(valor => valor + 1)}>Actualizar</button>
                    </div>
                    {cargando && <output className="d-block">Cargando solicitudes...</output>}
                    {error && <p role="alert" className="alert alert-warning">{error}</p>}
                    {errorDescarga && <p role="alert" className="alert alert-warning">{errorDescarga}</p>}
                    {!cargando && !error && solicitudes.length === 0 && <p className="text-muted">El solicitante no tiene solicitudes registradas.</p>}
                    {!cargando && !error && solicitudes.map(solicitud => (
                        <article key={solicitud.id} className="border rounded p-3 mb-3">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <strong>#{solicitud.id} · {solicitud.tipoSolicitud}</strong>
                                    <div className="small text-muted">{formatFecha(solicitud.fechaInicio)} — {formatFecha(solicitud.fechaFin)}</div>
                                    <span className={`badge ${tieneDocumentoAprobado(solicitud.estadoSolicitud) ? 'bg-success' : 'bg-secondary'}`}>{solicitud.estadoSolicitud}</span>
                                </div>
                                {tieneDocumentoAprobado(solicitud.estadoSolicitud) && (normalizarUrlPdf(solicitud.urlPdf) ? (
                                    <div className="d-flex flex-wrap gap-2">
                                        <a className="btn btn-outline-secondary btn-sm" href={normalizarUrlPdf(solicitud.urlPdf)}
                                            target="_blank" rel="noopener noreferrer" aria-label={`Ver PDF de solicitud ${solicitud.id}`}>Ver PDF</a>
                                        <button type="button" className="btn btn-outline-danger btn-sm" disabled={descargando !== null}
                                            onClick={() => descargarPdf(solicitud)} aria-label={`Descargar PDF de solicitud ${solicitud.id}`}>
                                            <i className="bi bi-download me-1" aria-hidden="true" />
                                            {descargando === solicitud.id ? 'Descargando...' : 'Descargar PDF'}
                                        </button>
                                    </div>
                                ) : <span className="small text-muted">PDF aprobado aún no disponible.</span>)}
                            </div>
                            <details className="mt-3">
                                <summary className="text-primary">Ver trazabilidad de solicitud #{solicitud.id}</summary>
                                <DetalleMiSolicitud solicitud={{ ...solicitud, trazabilidad: solicitud.trazabilidad || [] }} />
                            </details>
                        </article>
                    ))}
                    {!cargando && !error && resultado?.totalPages > 1 && (
                        <nav className="d-flex align-items-center justify-content-between gap-2" aria-label="Páginas del historial">
                            <button type="button" className="btn btn-outline-secondary btn-sm" disabled={pagina === 0}
                                onClick={() => setPagina(valor => valor - 1)}>Anterior</button>
                            <span className="small">Página {pagina + 1} de {resultado.totalPages} · {resultado.totalElements} solicitudes</span>
                            <button type="button" className="btn btn-outline-secondary btn-sm" disabled={pagina + 1 >= resultado.totalPages}
                                onClick={() => setPagina(valor => valor + 1)}>Siguiente</button>
                        </nav>
                    )}
                </div>
                <div className="historial-solicitante-footer">
                    <button type="button" className="btn btn-secondary" onClick={cerrar}>Cerrar</button>
                </div>
            </dialog>
        </div>
    );
}

export default HistorialSolicitante;
