import React from 'react';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { formatFecha } from '../../../services/utils';
import './MisSolicitudesMobile.css';
import PropTypes from 'prop-types';

import { getEtapaActual, getStatusBadge } from './estadoSolicitud';

const MisSolicitudesMobile = ({ solicitudes, openDetailId, handleToggleDetail, onAnulada }) => {

    return (
        <div className="mis-solicitudes-mobile-list">
            {solicitudes.map((solicitud, index) => (
                <div key={solicitud?.id || index} className={`mis-solicitudes-mobile-card ${solicitud.tipoSolicitud?.includes('FERIADO') ? 'feriado' : 'administrativo'}`}>
                    <div className="mis-solicitudes-mobile-card-header">
                        <div className="d-flex flex-column">
                            <span className="mis-solicitudes-mobile-type">{solicitud.tipoSolicitud || 'Solicitud'}</span>
                            <span className="mis-solicitudes-mobile-id">Folio #{solicitud?.id || 'N/A'}</span>
                        </div>
                        <span className={getStatusBadge(solicitud.estadoSolicitud)}>
                            {solicitud.estadoSolicitud || 'No especificado'}
                        </span>
                    </div>
                    <div className="mis-solicitudes-mobile-card-body">
                        <div className="small text-muted">{getEtapaActual(solicitud)}</div>
                        <div className="mis-solicitudes-mobile-card-info">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="mis-solicitudes-mobile-card-item mb-0">
                                    <i className="bi bi-clock-history"></i>
                                    <span className="label">Duración:</span>
                                    <span className="badge bg-light text-dark border rounded-pill px-3">
                                        {solicitud?.cantidadDias ?? solicitud?.diasSolicitados ?? '—'} días
                                    </span>
                                </div>
                            </div>
                            <div className="mis-solicitudes-mobile-card-item">
                                <i className="bi bi-calendar-event"></i>
                                <span className="label">Desde:</span>
                                <span>{solicitud?.fechaInicio ? formatFecha(solicitud.fechaInicio) : 'N/A'}</span>
                            </div>
                            <div className="mis-solicitudes-mobile-card-item">
                                <i className="bi bi-calendar-check"></i>
                                <span className="label">Hasta:</span>
                                <span>{(solicitud?.fechaFin || solicitud?.fechaTermino) ? formatFecha(solicitud?.fechaFin || solicitud?.fechaTermino) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mis-solicitudes-mobile-card-actions d-flex justify-content-end align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm text-nowrap"
                                onClick={() => handleToggleDetail(solicitud.id)}
                                disabled={!solicitud?.id}
                                aria-expanded={openDetailId === solicitud.id}
                            >
                                {openDetailId === solicitud.id ? 'Cerrar detalle' : 'Ver detalle'}
                            </button>
                        </div>
                    </div>
                    {openDetailId === solicitud.id && (
                        <div className="p-3 bg-light rounded-bottom">
                            <DetalleMiSolicitud solicitud={solicitud} urlPdf={solicitud.urlPdf} onAnulada={onAnulada} />
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
        urlPdf: PropTypes.string,
    })).isRequired,
    openDetailId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onAnulada: PropTypes.func.isRequired,
    handleToggleDetail: PropTypes.func.isRequired,
};

export default MisSolicitudesMobile;
