import { useCallback, useContext, useEffect, useState } from 'react';
import SolicitudItem from './SolicitudItem';
import SolicitudItemMobile from './SolicitudItemMobile';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { getInboxSolicitudesByDepto } from '../../../services/inboxSolicitudes';
import FiltrosSolicitudes from './FiltroSolicitudes';
import { useAccionesSolicitud } from '../../../hooks/useAccionesSolicitud';
import { useSolicitudesNoLeidas } from '../../../hooks/useSolicitudesNoLeidas';

const InboxSolicitudes = () => {
    const funcionario = useContext(UsuarioContext);
    const [solicitudes, setSolicitudes] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [filtroAplicado, setFiltroAplicado] = useState({});
    const [rutFuncionario, setRutFuncionario] = useState('');
    const [currentPage, setCurrentPage ] =useState(0)
    const [totalPages,setTotalPages] = useState(null);
    const [totalElements,setTotalElements] = useState(null);

    const [detalleAbiertoId, setDetalleAbiertoId] = useState(null);

    const { refetch } = useSolicitudesNoLeidas();

    const handleVerDetalleClick = (idSolicitud) => {
        setDetalleAbiertoId(detalleAbiertoId === idSolicitud ? null : idSolicitud);
    };


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchPermisos = useCallback(async () => {
        if (!funcionario) return;

        try {
            const response = await getInboxSolicitudesByDepto(funcionario.codDepto,currentPage);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
            setSolicitudes(response.solicitudes);
        } catch (error) {
            console.error("Error al obtener funcionario:", error);
        }
    }, [currentPage, funcionario]);

    const handleActualizarSolicitud = async () => {
        await fetchPermisos();
        refetch();
    };

    const { handlerEntrada, handlerVisar, handlerAprobar } = useAccionesSolicitud(rutFuncionario, handleActualizarSolicitud, refetch);

    useEffect(() => {
        if (funcionario) {
            setRutFuncionario(funcionario.rut);
        }
    }, [funcionario]);

    useEffect(() => {
        fetchPermisos();
    }, [fetchPermisos]);

    const handleFiltrarSolicitudes = (filtros) => {
        setFiltroAplicado(filtros);
        console.log("aplicando filtros");
    };

    // Lógica para filtrar las solicitudes basadas en el estado 'filtroAplicado'
    const solicitudesFiltradas = solicitudes.filter(solicitud => {
        const { anio, fechaInicio, fechaFin, nombreSolicitante, rutSolicitante } = filtroAplicado;
        const fechaSolicitudObj = new Date(solicitud.fechaSolicitud);
        const anioSolicitud = fechaSolicitudObj.getFullYear();

        const cumpleAnio = !anio || anioSolicitud === parseInt(anio);
        const cumpleFechaInicio = !fechaInicio || fechaSolicitudObj >= new Date(fechaInicio);
        const cumpleFechaFin = !fechaFin || fechaSolicitudObj <= new Date(fechaFin);
        const cumpleNombre = !nombreSolicitante || solicitud.solicitante.toLowerCase().includes(nombreSolicitante.toLowerCase());
        const cumpleRut = !rutSolicitante || solicitud.rutSolicitante?.includes(rutSolicitante);

        return cumpleAnio && cumpleFechaInicio && cumpleFechaFin && cumpleNombre && cumpleRut;
    });

    return (
        <div className="container-fluid mt-4">
            <FiltrosSolicitudes onFiltrar={handleFiltrarSolicitudes} /> {/* Renderiza el componente de filtros */}
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 font-weight-bold text-primary">Bandeja de Solicitudes</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive d-none d-md-block">
                                <table className="table table-striped table-hover mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th><i className="bi bi-hash me-2"></i> ID</th>
                                            <th><i className="bi bi-person-fill me-2"></i> Solicitante</th>
                                            <th><i className="bi bi-type me-2"></i> Tipo Solicitud</th>
                                            <th><i className="bi bi-calendar-date me-2"></i> Fecha Solicitud</th>
                                            <th><i className="bi bi-exclamation-circle-fill me-2"></i> Estado Solicitud</th>
                                            <th className="text-right"><i className="bi bi-gear-fill me-2"></i> Acciones</th>
                                            <th className="text-right"><i className="bi bi-info-circle-fill me-2"></i> Detalle</th>
                                        </tr>
                                    </thead>
                                    <tbody  >
                                        {solicitudesFiltradas.map((solicitud) => (
                                            <SolicitudItem
                                                key={solicitud.id}
                                                solicitud={solicitud}
                                                onActualizarSolicitud={handleActualizarSolicitud}
                                                rutFuncionario={rutFuncionario}
                                                handlerEntrada={handlerEntrada}
                                                handlerVisar={handlerVisar}
                                                open={detalleAbiertoId === solicitud.id}
                                                handlerAprobar={handlerAprobar}
                                                handleVerDetalleClick={() => handleVerDetalleClick(solicitud.id)}

                                            />

                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {isMobile && (
                                <div>
                                    {solicitudesFiltradas.map((solicitud) => (
                                        <SolicitudItemMobile
                                            key={solicitud.id}
                                            solicitud={solicitud}
                                            open={detalleAbiertoId === solicitud.id}
                                            handlerEntrada={handlerEntrada}
                                            handlerVisar={handlerVisar}
                                            handlerAprobar={handlerAprobar}
                                            handleVerDetalleClick={() => handleVerDetalleClick(solicitud.id)}
                                        />
                                    ))}
                                    {solicitudesFiltradas.length === 0 && (
                                        <div className="p-4 text-center text-muted">
                                            No se encontraron solicitudes con los filtros aplicados.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InboxSolicitudes;