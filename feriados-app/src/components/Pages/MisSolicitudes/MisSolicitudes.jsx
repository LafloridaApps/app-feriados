import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { formatFecha } from '../../../services/utils';
import DetalleMiSolicitud from './DetalleMiSolicitud';

// Datos de ejemplo (mock) actualizados con departamento en la trazabilidad
const mockSolicitudes = [
    {
        id: 2024001,
        tipoSolicitud: 'FERIADO LEGAL',
        fechaSolicitud: '2024-07-15T10:00:00.000Z',
        estadoSolicitud: 'APROBADA',
        fechaInicio: '2024-08-01',
        fechaFin: '2024-08-05',
        cantidadDias: 3,
        trazabilidad: [
            { fecha: '2024-07-15', accion: 'CREACIÓN', usuario: 'Mirko Gutierrez', departamento: 'Tecnología' },
            { fecha: '2024-07-16', accion: 'VISACIÓN', usuario: 'Jefe Directo', departamento: 'Tecnología' },
            { fecha: '2024-07-17', accion: 'APROBACIÓN', usuario: 'Gerencia RRHH', departamento: 'Recursos Humanos' },
        ]
    },
    {
        id: 2024002,
        tipoSolicitud: 'PERMISO ADMINISTRATIVO',
        fechaSolicitud: '2024-08-01T11:30:00.000Z',
        estadoSolicitud: 'PENDIENTE',
        fechaInicio: '2024-08-20',
        fechaFin: '2024-08-20',
        cantidadDias: 1,
        trazabilidad: [
            { fecha: '2024-08-01', accion: 'CREACIÓN', usuario: 'Mirko Gutierrez', departamento: 'Tecnología' },
        ]
    },
    {
        id: 2024003,
        tipoSolicitud: 'FERIADO LEGAL',
        fechaSolicitud: '2024-06-20T09:00:00.000Z',
        estadoSolicitud: 'RECHAZADA',
        fechaInicio: '2024-07-01',
        fechaFin: '2024-07-05',
        cantidadDias: 5,
        trazabilidad: [
            { fecha: '2024-06-20', accion: 'CREACIÓN', usuario: 'Mirko Gutierrez', departamento: 'Tecnología' },
            { fecha: '2024-06-21', accion: 'RECHAZO', usuario: 'Jefe Directo', departamento: 'Tecnología' },
        ]
    },
];

const getStatusBadge = (status) => {
    switch (status) {
        case 'APROBADA':
            return 'badge bg-success';
        case 'RECHAZADA':
            return 'badge bg-danger';
        case 'PENDIENTE':
            return 'badge bg-warning text-dark';
        case 'PENDIENTE VISACION':
            return 'badge bg-info text-dark';
        default:
            return 'badge bg-secondary';
    }
};

const MisSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDetailId, setOpenDetailId] = useState(null);
    const funcionario = useContext(UsuarioContext);

    useEffect(() => {
        const fetchMockData = () => {
            setTimeout(() => {
                setSolicitudes(mockSolicitudes);
                setLoading(false);
            }, 500);
        };
        fetchMockData();
    }, []);

    const handleToggleDetail = (id) => {
        setOpenDetailId(openDetailId === id ? null : id);
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 font-weight-bold text-primary">
                        <i className="bi bi-journal-text me-2"></i>
                        Mis Solicitudes
                        {funcionario?.nombre && <span className="text-muted"> - {funcionario.nombre} {funcionario.apellidoPaterno} {funcionario.apellidoMaterno} </span>}
                    </h5>
                </div>
                <div className="card-body p-0"> {/* Remove padding from card-body */}
                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>ID Solicitud</th>
                                        <th>Tipo de Solicitud</th>
                                        <th>Fecha de Creación</th>
                                        <th>Estado</th>
                                        <th className="text-center">Detalle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudes.map((solicitud) => (
                                        <>
                                            <tr key={solicitud.id}>
                                                <td>{solicitud.id}</td>
                                                <td>{solicitud.tipoSolicitud}</td>
                                                <td>{formatFecha(solicitud.fechaSolicitud)}</td>
                                                <td>
                                                    <span className={getStatusBadge(solicitud.estadoSolicitud)}>
                                                        {solicitud.estadoSolicitud}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleToggleDetail(solicitud.id)}
                                                    >
                                                        <i className={`bi ${openDetailId === solicitud.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            {openDetailId === solicitud.id && (
                                                <tr>
                                                    <td colSpan="5" className="p-0">
                                                        <DetalleMiSolicitud solicitud={solicitud} />
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="card-footer text-muted">
                    Mostrando {solicitudes.length} solicitudes.
                </div>
            </div>
        </div>
    );
};

export default MisSolicitudes;
