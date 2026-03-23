import React from 'react';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { formatFecha } from '../../../services/utils'; // Asegúrate de que esta importación sea correcta

const getStatusBadge = (status) => {
    switch (status) {
        case 'APROBADA':
            return 'badge-premium status-aprobada';
        case 'POSTERGADA':
            return 'badge-premium status-postergada';
        case 'PENDIENTE':
        case 'PENDIENTE VISACION':
            return 'badge-premium status-pendiente';
        case 'FINALIZADA':
            return 'badge-premium status-finalizada';
        default:
            return 'badge-premium status-finalizada';
    }
};

const MisSolicitudesTable = ({ solicitudes, openDetailId, handleToggleDetail }) => {

    return (
        <div className="table-responsive">
            <table className="table mis-solicitudes-table mb-0">
                <thead>
                    <tr>
                        <th style={{ width: '120px' }}>ID</th>
                        <th>Tipo de Solicitud</th>
                        <th>Fecha Creación</th>
                        <th>Estado</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map((solicitud, index) => (
                        <React.Fragment key={solicitud?.id || index}>
                            <tr className={openDetailId === solicitud.id ? 'table-active' : ''}>
                                <td>
                                    <span className="text-muted">#</span>
                                    {solicitud?.id || 'N/A'}
                                </td>
                                <td>
                                    <div className="fw-bold">{solicitud?.tipoSolicitud || 'No especificado'}</div>
                                </td>
                                <td>{solicitud?.fechaSolicitud ? formatFecha(solicitud.fechaSolicitud) : 'Fecha no disponible'}</td>
                                <td>
                                    <span className={getStatusBadge(solicitud?.estadoSolicitud)}>
                                        {solicitud?.estadoSolicitud || 'No especificado'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center gap-2">
                                        <button
                                            className="btn btn-action"
                                            onClick={() => handleToggleDetail(solicitud.id)}
                                            disabled={!solicitud?.id}
                                            title="Ver Detalles"
                                        >
                                            <i className={`bi ${openDetailId === solicitud.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                        </button>
                                        {solicitud.urlPdf && (
                                            <a
                                                href={solicitud.urlPdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-action btn-action-pdf"
                                                title="Ver PDF"
                                            >
                                                <i className="bi bi-file-earmark-pdf"></i>
                                            </a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            {openDetailId === solicitud.id && (
                                <tr>
                                    <td colSpan="5" className="p-0 border-0">
                                        <div className="px-4 pb-4">
                                            <DetalleMiSolicitud solicitud={solicitud} />
                                        </div>
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

import PropTypes from 'prop-types';

MisSolicitudesTable.propTypes = {
    solicitudes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tipoSolicitud: PropTypes.string,
        fechaSolicitud: PropTypes.string,
        estadoSolicitud: PropTypes.string,
        urlPdf: PropTypes.string
    })).isRequired,
    openDetailId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handleToggleDetail: PropTypes.func.isRequired
};

export default MisSolicitudesTable;