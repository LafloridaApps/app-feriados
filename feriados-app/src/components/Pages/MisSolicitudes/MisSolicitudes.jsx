import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { getSolicitudesByRut } from '../../../services/misSolicitudesService';
import MisSolicitudesLoadingSpinner from './MisSolicitudesLoadingSpinner';
import MisSolicitudesNoDataMessage from './MisSolicitudesNoDataMessage';
import MisSolicitudesTable from './MisSolicitudesTable';
import MisSolicitudesPagination from './MisSolicitudesPagination';
import MisSolicitudesMobile from './MisSolicitudesMobile'; // Importar el componente móvil
import useTamanoVentana from '../../../hooks/useTamanoVentana'; // Importar el hook de tamaño de ventana
import './MisSolicitudes.css'; // Importar el archivo CSS personalizado

const MisSolicitudes = () => {
    const { ancho } = useTamanoVentana(); // Obtener el ancho de la ventana
    const isMobile = ancho < 768; // Definir el breakpoint para móvil

    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDetailId, setOpenDetailId] = useState(null);
    const funcionario = useContext(UsuarioContext);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);


    useEffect(() => {
        const fetSolicitudesByRut = async () => {
            setLoading(true);
            try {
                const response = await getSolicitudesByRut(funcionario.rut, currentPage, pageSize);
                setSolicitudes(Array.isArray(response.solicitudes) ? response.solicitudes : []);
                setTotalPages(response.totalPages);
                setCurrentPage(response.currentPage);
                setTotalElements(response.totalElements);
            } catch {
                // Bloque intencionalmente vacío
            } finally {
                setLoading(false);
            }
        };

        if (funcionario?.rut) {
            fetSolicitudesByRut();
        }
    }, [funcionario, currentPage, pageSize]);

    const handleToggleDetail = (id) => {
        setOpenDetailId(openDetailId === id ? null : id);
    };

    const renderContent = () => {
        if (loading) {
            return <MisSolicitudesLoadingSpinner />;
        }

        if (solicitudes.length === 0) {
            return <MisSolicitudesNoDataMessage />;
        }

        if (isMobile) {
            return (
                <MisSolicitudesMobile
                    solicitudes={solicitudes}
                    openDetailId={openDetailId}
                    handleToggleDetail={handleToggleDetail}
                />
            );
        }

        return (
            <div className="mis-solicitudes-table-wrapper">
                <MisSolicitudesTable
                    solicitudes={solicitudes}
                    openDetailId={openDetailId}
                    handleToggleDetail={handleToggleDetail}
                />
            </div>
        );
    };


    return (
        <div className="container-fluid py-4 mis-solicitudes-container">
            {/* Standardized Page Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-1 text-primary fw-bold">
                        <i className="bi bi-journal-text me-2"></i>{' '}
                        Mis Solicitudes
                    </h2>
                    {funcionario?.nombre && (
                        <p className="text-muted mb-0">
                            Gestión de permisos para {funcionario.nombre} {funcionario.apellidoPaterno} {funcionario.apellidoMaterno}
                        </p>
                    )}
                </div>
            </div>

            <div className="card mis-solicitudes-card">
                <div className="card-body p-0">
                    {renderContent()}
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
