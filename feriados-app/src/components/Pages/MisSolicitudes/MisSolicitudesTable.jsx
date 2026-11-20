import React from 'react';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { formatFecha } from '../../../services/utils';

import { getEtapaActual, getStatusBadge } from './estadoSolicitud';

const MisSolicitudesTable = ({ solicitudes, openDetailId, handleToggleDetail, onAnulada }) => {

    return (
        <div className="table-responsive">
            <table className="table mis-solicitudes-table mb-0">
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Tipo de Solicitud</th>
                        <th>Período</th>
                        <th>Días</th>
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
                                <td>
                                    {solicitud.fechaInicio && solicitud.fechaFin
                                        ? `${formatFecha(solicitud.fechaInicio)} al ${formatFecha(solicitud.fechaFin)}`
                                        : 'Sin información'}
                                </td>
                                <td>{solicitud.cantidadDias ?? '—'}</td>
                                <td>
                                    <span className={getStatusBadge(solicitud?.estadoSolicitud)}>
                                        {solicitud?.estadoSolicitud || 'No especificado'}
                                    </span>
                                    <div className="small text-muted">{getEtapaActual(solicitud)}</div>
                                </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center align-items-center gap-2">
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
                                </td>
                            </tr>
                            {openDetailId === solicitud.id && (
                                <tr>
                                    <td colSpan="6" className="p-0 border-0">
                                        <div className="p-4 bg-light border-bottom">
                                            <DetalleMiSolicitud solicitud={solicitud} urlPdf={solicitud.urlPdf} onAnulada={onAnulada} />
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
        urlPdf: PropTypes.string,
    })).isRequired,
    openDetailId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onAnulada: PropTypes.func.isRequired,
    handleToggleDetail: PropTypes.func.isRequired
};

export default MisSolicitudesTable;
