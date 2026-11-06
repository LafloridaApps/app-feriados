import MisSolicitudesPagination from './MisSolicitudesPagination';
import EncabezadoMisSolicitudes from './MisSolicitudes/EncabezadoMisSolicitudes';
import ContenidoMisSolicitudes from './MisSolicitudes/ContenidoMisSolicitudes';
import { useMisSolicitudes } from './MisSolicitudes/useMisSolicitudes';
import './MisSolicitudes.css';

const MisSolicitudes = () => {
    const {
        funcionario, isMobile, solicitudes, loading, openDetailId, handleToggleDetail,
        currentPage, setCurrentPage, totalPages, totalElements,
    } = useMisSolicitudes();

    return (
        <div className="container-fluid py-4 mis-solicitudes-container">
            <EncabezadoMisSolicitudes funcionario={funcionario} />

            <div className="card mis-solicitudes-card">
                <div className="card-body p-0">
                    <ContenidoMisSolicitudes loading={loading} solicitudes={solicitudes} isMobile={isMobile}
                        openDetailId={openDetailId} handleToggleDetail={handleToggleDetail} />
                </div>
                <div className="pagination-container">
                    <MisSolicitudesPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        solicitudesLength={solicitudes.length}
                        totalElements={totalElements}
                    />
                </div>
            </div>
        </div>
    );
};

export default MisSolicitudes;
