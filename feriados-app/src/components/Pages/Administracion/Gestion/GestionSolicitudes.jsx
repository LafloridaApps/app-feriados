import { useEffect, useRef } from 'react';
import TrazabilidadCard from './components/TrazabilidadCard';
import SearchSolicitud from './components/SearchSolicitud';
import DetalleGestionSolicitud from './components/DetalleGestionSolicitud';
import { useVisorSolicitudes } from './useVisorSolicitudes';
import './GestionSolicitudes.css';

export const GestionSolicitudes = () => {
    const {
        solicitud, loading, error,
        buscarSolicitud, limpiarSolicitud, handleAnular,
    } = useVisorSolicitudes();

    const detalle = useRef(null);
    useEffect(() => {
        if (solicitud && !detalle.current.open) detalle.current.showModal();
    }, [solicitud]);
    useEffect(() => {
        if (!solicitud) return;
        const anterior = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = anterior; };
    }, [solicitud]);

    return (
        <div className="container-fluid mt-4 mb-5 fade-in visor-solicitudes">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-1 text-primary fw-bold">Visor de Solicitudes</h2>
                    <p className="text-muted mb-0">Consulte el estado, trazabilidad y gestione la anulación de solicitudes.</p>
                </div>
            </div>

            <SearchSolicitud onSelect={buscarSolicitud} onReset={limpiarSolicitud} detailLoading={loading} />
            {loading && <p role="status" className="text-primary my-3">Cargando detalle de la solicitud…</p>}

            {error && (
                <div className="alert alert-danger shadow-sm border-0 rounded-3 mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
            )}

            <dialog ref={detalle} className="visor-detail-dialog" aria-labelledby="visor-detail-title"
                onClose={limpiarSolicitud}>
                <header className="visor-detail-header">
                    <div className="d-flex align-items-center gap-3">
                        <span className="visor-detail-icon"><i className="bi bi-file-earmark-text" aria-hidden="true" /></span>
                        <div><p className="visor-detail-eyebrow">Visor de solicitudes</p>
                            <h3 id="visor-detail-title">Solicitud #{solicitud?.id || solicitud?.idSolicitud || '…'}</h3>
                            <p className="visor-detail-subtitle">{solicitud?.nombreFuncionario || 'Detalle y seguimiento de la solicitud'}</p>
                        </div>
                    </div>
                    <button type="button" className="btn-close" aria-label="Cerrar detalle" autoFocus
                        onClick={() => detalle.current.close()} />
                </header>
                <div className="visor-detail-body" aria-busy={loading}>
                    {loading && <p role="status" className="alert alert-info">Cargando detalle de la solicitud…</p>}
                    {error && <p role="alert" className="alert alert-danger">{error}</p>}
                    {solicitud && <div className="row g-4">
                        <div className="col-lg-5"><DetalleGestionSolicitud solicitud={solicitud} loading={loading} handleAnular={handleAnular} /></div>
                        <div className="col-lg-7"><TrazabilidadCard derivaciones={solicitud.derivaciones} cantidadDias={solicitud.cantidadDias} /></div>
                    </div>}
                </div>
                <footer className="visor-detail-footer">
                    <span className="small text-muted">Cierra el detalle para volver a los resultados.</span>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => detalle.current.close()}>Volver a resultados</button>
                </footer>
            </dialog>
        </div>
    );
};
