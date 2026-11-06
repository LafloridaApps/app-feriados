import TrazabilidadCard from './components/TrazabilidadCard';
import SearchSolicitud from './components/SearchSolicitud';
import DetalleGestionSolicitud from './components/DetalleGestionSolicitud';
import { useVisorSolicitudes } from './useVisorSolicitudes';
import './GestionSolicitudes.css';

export const GestionSolicitudes = () => {
    const {
        solicitudId, setSolicitudId, solicitud, loading, error,
        handleSearch, handleAnular,
    } = useVisorSolicitudes();

    return (
        <div className="container-fluid mt-4 mb-5 fade-in">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-1 text-primary fw-bold">Visor de Solicitudes</h2>
                    <p className="text-muted mb-0">Consulte el estado, trazabilidad y gestione la anulación de solicitudes.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm border mb-4">
                <SearchSolicitud
                    solicitudId={solicitudId}
                    setSolicitudId={setSolicitudId}
                    handleSearch={handleSearch}
                    loading={loading && !solicitud}
                />
            </div>

            {error && (
                <div className="alert alert-danger shadow-sm border-0 rounded-3 mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
            )}

            {solicitud && (
                <div className="row g-4">
                    <div className="col-lg-5 col-xl-4">
                        <DetalleGestionSolicitud solicitud={solicitud} loading={loading} handleAnular={handleAnular} />
                    </div>

                    <div className="col-lg-7 col-xl-8">
                        <TrazabilidadCard derivaciones={solicitud.derivaciones} />
                    </div>
                </div>
            )}
        </div>
    );
};
