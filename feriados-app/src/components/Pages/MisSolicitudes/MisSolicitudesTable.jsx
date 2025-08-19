import React from 'react';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { formatFecha } from '../../../services/utils'; // Asegúrate de que esta importación sea correcta

const getStatusBadge = (status) => {
    switch (status) {
        case 'APROBADA':
            return 'badge bg-success';
        case 'POSTERGADA':
            return 'badge bg-danger';
        case 'PENDIENTE':
            return 'badge bg-warning text-dark';
        case 'PENDIENTE VISACION':
            return 'badge bg-info text-dark';
        default:
            return 'badge bg-secondary';
    }
};

const MisSolicitudesTable = ({ solicitudes, openDetailId, handleToggleDetail }) => {
    return (
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