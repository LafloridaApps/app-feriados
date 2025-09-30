import React from 'react';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { formatFecha } from '../../../services/utils'; // Asegúrate de que esta importación sea correcta

const getStatusBadge = (status) => {
    switch (status) {
        case 'APROBADA':
            return 'badge badge-estado-aprobado';
        case 'POSTERGADA':
            return 'badge badge-estado-rechazado'; // Asumiendo que postergada es similar a rechazada en color
        case 'PENDIENTE':
            return 'badge badge-estado-pendiente';
        case 'PENDIENTE VISACION':
            return 'badge badge-estado-pendiente'; // Usar el mismo color que pendiente
        case 'FINALIZADA':
            return 'badge badge-estado-finalizado';
        default:
            return 'badge badge-estado-otro';
    }
};

const MisSolicitudesTable = ({ solicitudes, openDetailId, handleToggleDetail }) => {

    return (
        <div className="table-responsive">
            <table className="table table-hover mb-0 mis-solicitudes-table">
                <thead className="bg-light">
                    <tr>
                        <th>ID Solicitud</th>
                        <th>Tipo de Solicitud</th>
                        <th>Fecha de Creación</th>
                        <th>Estado</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map((solicitud, index) => (
                        <React.Fragment key={solicitud?.id || index}>
                            <tr>
                                <td>{solicitud?.id || 'N/A'}</td>
                                <td>{solicitud?.tipoSolicitud || 'No especificado'}</td>
                                <td>{solicitud?.fechaSolicitud ? formatFecha(solicitud.fechaSolicitud) : 'Fecha no disponible'}</td>
                                <td>
                                    {solicitud?.estadoSolicitud ? (
                                        <span className={getStatusBadge(solicitud.estadoSolicitud)}>
                                            {solicitud.estadoSolicitud}
                                        </span>
                                    ) : (
                                        <span className={getStatusBadge('')}>No especificado</span>
                                    )}
                                </td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleToggleDetail(solicitud.id)}
                                        disabled={!solicitud?.id}
                                    >
                                        <i className={`bi ${openDetailId === solicitud.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                    </button>
                                    {solicitud.urlPdf && (
                                        <a
                                            href={solicitud.urlPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-danger ms-2"
                                            title="Ver Documento PDF"
                                        >
                                            <i className="bi bi-file-earmark-pdf"></i>
                                        </a>
                                    )}
                                </td>
                            </tr>
                            {openDetailId === solicitud.id && (
                                <tr>
                                    <td colSpan="5" className="p-0">
                                        <DetalleMiSolicitud solicitud={solicitud} />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MisSolicitudesTable;