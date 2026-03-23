import React from 'react';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { formatFecha } from '../../../services/utils';
import './MisSolicitudesMobile.css';
import PropTypes from 'prop-types';

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

const MisSolicitudesMobile = ({ solicitudes, openDetailId, handleToggleDetail }) => {
    return (
        <div className="mis-solicitudes-mobile-list">
            {solicitudes.map((solicitud, index) => (
                <div key={solicitud?.id || index} className="mis-solicitudes-mobile-card">
                    <div className="mis-solicitudes-mobile-card-header">
                        <span className="mis-solicitudes-mobile-id">ID #{solicitud?.id || 'N/A'}</span>
                        <span className={getStatusBadge(solicitud.estadoSolicitud)}>
                            {solicitud.estadoSolicitud || 'No especificado'}
                        </span>
                    </div>
                    <div className="mis-solicitudes-mobile-card-body">
                        <div className="mis-solicitudes-mobile-card-title">
                            {solicitud?.tipoSolicitud || 'No especificado'}
                        </div>
                        <div className="mis-solicitudes-mobile-card-info">
                            <div className="mis-solicitudes-mobile-card-item">
                                <i className="bi bi-calendar3"></i>
                                <span>{solicitud?.fechaSolicitud ? formatFecha(solicitud.fechaSolicitud) : 'Fecha no disponible'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mis-solicitudes-mobile-card-actions">
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
                    {openDetailId === solicitud.id && (
                        <div className="px-3 pb-3">
                            <DetalleMiSolicitud solicitud={solicitud} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

MisSolicitudesMobile.propTypes = {
    solicitudes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tipoSolicitud: PropTypes.string,
        fechaSolicitud: PropTypes.string,
        estadoSolicitud: PropTypes.string,
        urlPdf: PropTypes.string
    })).isRequired,
    openDetailId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handleToggleDetail: PropTypes.func.isRequired,
};

export default MisSolicitudesMobile;
