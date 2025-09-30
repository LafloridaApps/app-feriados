import React from 'react';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { formatFecha } from '../../../services/utils';
import './MisSolicitudesMobile.css';

const getStatusBadge = (status) => {
    switch (status) {
        case 'APROBADA':
            return 'badge badge-estado-aprobado';
        case 'POSTERGADA':
            return 'badge badge-estado-rechazado';
        case 'PENDIENTE':
            return 'badge badge-estado-pendiente';
        case 'PENDIENTE VISACION':
            return 'badge badge-estado-pendiente';
        case 'FINALIZADA':
            return 'badge badge-estado-finalizado';
        default:
            return 'badge badge-estado-otro';
    }
};

const MisSolicitudesMobile = ({ solicitudes, openDetailId, handleToggleDetail }) => {
    return (
        <div className="mis-solicitudes-mobile-list p-3">
            {solicitudes.map((solicitud, index) => (
                <div key={solicitud?.id || index} className="mis-solicitudes-mobile-card">
                    <div className="mis-solicitudes-mobile-card-header">
                        <span>ID: {solicitud?.id || 'N/A'}</span>
                        <span className={getStatusBadge(solicitud.estadoSolicitud)}>
                            {solicitud.estadoSolicitud}
                        </span>
                    </div>
                    <div className="mis-solicitudes-mobile-card-body">
                        <div className="mis-solicitudes-mobile-card-item">
                            <strong>Tipo:</strong> {solicitud?.tipoSolicitud || 'No especificado'}
                        </div>
                        <div className="mis-solicitudes-mobile-card-item">
                            <strong>Fecha:</strong> {solicitud?.fechaSolicitud ? formatFecha(solicitud.fechaSolicitud) : 'No disponible'}
                        </div>
                        {/* Add more details here if needed */}
                    </div>
                    <div className="mis-solicitudes-mobile-card-actions">
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
                    </div>
                    {openDetailId === solicitud.id && (
                        <div className="p-3">
                            <DetalleMiSolicitud solicitud={solicitud} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MisSolicitudesMobile;
