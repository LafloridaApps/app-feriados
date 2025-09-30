import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { getSolicitudesByRut } from '../../../services/misSolicitudesService';
import MisSolicitudesLoadingSpinner from './MisSolicitudesLoadingSpinner';
import MisSolicitudesNoDataMessage from './MisSolicitudesNoDataMessage';
import MisSolicitudesTable from './MisSolicitudesTable';
import MisSolicitudesPagination from './MisSolicitudesPagination';
import MisSolicitudesMobile from './MisSolicitudesMobile'; // Importar el componente móvil
import useWindowSize from '../../../hooks/useWindowSize'; // Importar el hook de tamaño de ventana
import './MisSolicitudes.css'; // Importar el archivo CSS personalizado

const MisSolicitudes = () => {
    const { width } = useWindowSize(); // Obtener el ancho de la ventana
    const isMobile = width < 768; // Definir el breakpoint para móvil

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

        if (funcionario && funcionario.rut) {
            fetSolicitudesByRut();
        }
    }, [funcionario, currentPage, pageSize]);

    const handleToggleDetail = (id) => {
        setOpenDetailId(openDetailId === id ? null : id);
    };


    return (
        <div className="container-fluid mt-4 mis-solicitudes-container">
            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 font-weight-bold text-primary mis-solicitudes-header">
                        <i className="bi bi-journal-text me-2"></i>
                        Mis Solicitudes
                        {funcionario?.nombre && <span className="text-muted"> - {funcionario.nombre} {funcionario.apellidoPaterno} {funcionario.apellidoMaterno} </span>}
                    </h5>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <MisSolicitudesLoadingSpinner />
                    ) : (
                        solicitudes.length === 0 ? (
                            <MisSolicitudesNoDataMessage />
                        ) : (
                            isMobile ? (
                                <MisSolicitudesMobile
                                    solicitudes={solicitudes}
                                    openDetailId={openDetailId}
                                    handleToggleDetail={handleToggleDetail}
                                />
                            ) : (
                                <div className="mis-solicitudes-table-wrapper">
                                    <MisSolicitudesTable
                                        solicitudes={solicitudes}
                                        openDetailId={openDetailId}
                                        handleToggleDetail={handleToggleDetail}
                                    />
                                </div>
                            )
                        )
                    )}
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
