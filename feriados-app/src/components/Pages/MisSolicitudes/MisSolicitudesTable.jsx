import React from 'react';
import Swal from 'sweetalert2';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { formatFecha } from '../../../services/utils';
import { anularSolicitud } from '../../../services/anulacionService';

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
        case 'ANULADA':
            return 'badge-premium status-anulada';
        default:
            return 'badge-premium status-finalizada';
    }
};

const MisSolicitudesTable = ({ solicitudes, openDetailId, handleToggleDetail }) => {

    const handleAnularEnvio = async (solicitudId) => {
        // Paso 1: Confirmación
        const confirmacion = await Swal.fire({
            icon: 'warning',
            title: '¿Anular solicitud?',
            html: `
                <p>¿Estás seguro de que deseas anular la solicitud <strong>#${solicitudId}</strong>?</p>
                <p class="text-muted small mb-0">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    Esta acción dejará sin efecto el flujo actual de la solicitud.
                </p>
            `,
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: '<i class="bi bi-x-circle"></i> Sí, anular',
            cancelButtonText: 'No, mantener',
            reverseButtons: true,
        });

        if (!confirmacion.isConfirmed) return;

        // Paso 2: Solicitar motivo
        const { value: motivo, isConfirmed: motivoConfirmado } = await Swal.fire({
            title: 'Motivo de anulación',
            input: 'textarea',
            inputLabel: 'Indica el motivo por el que deseas anular esta solicitud',
            inputPlaceholder: 'Ej: Error en las fechas seleccionadas...',
            inputAttributes: { maxlength: 300, rows: 4 },
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Confirmar anulación',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            inputValidator: (value) => {
                if (!value?.trim()) return 'Debes ingresar un motivo para continuar.';
                if (value.trim().length < 10) return 'El motivo debe tener al menos 10 caracteres.';
            },
        });

        if (!motivoConfirmado) return;

        // Paso 3: Llamar al servicio
        try {
            const respuesta = await anularSolicitud(solicitudId, motivo.trim());
            const mensajeServidor = respuesta?.message || respuesta?.mensaje || 'El envío de la solicitud fue anulado correctamente.';
            await Swal.fire({
                icon: 'success',
                title: 'Solicitud anulada',
                text: mensajeServidor,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#16a34a',
            });
            globalThis.location.reload();
        } catch (error) {
            const mensajeError =
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                error.response?.data?.error ||
                error.message ||
                'No se pudo anular la solicitud. Intenta nuevamente.';
            Swal.fire({
                icon: 'error',
                title: 'Error al anular',
                text: mensajeError,
            });
        }
    };

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
                                    <div className="d-flex justify-content-center align-items-center gap-2">
                                        <button
                                            className="btn btn-action"
                                            onClick={() => handleToggleDetail(solicitud.id)}
                                            disabled={!solicitud?.id}
                                            title="Ver Detalles"
                                        >
                                            <i className={`bi ${openDetailId === solicitud.id ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                                        </button>
                                        {solicitud.urlPdf && (
                                            <a
                                                href={solicitud.urlPdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-action btn-action-pdf"
                                                title="Ver PDF"
                                            >
                                                <i className="bi bi-file-earmark-pdf" />
                                            </a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            {openDetailId === solicitud.id && (
                                <tr>
                                    <td colSpan="5" className="p-0 border-0">
                                        <div className="p-4 bg-light border-bottom">
                                            <DetalleMiSolicitud solicitud={solicitud} />
                                            {solicitud?.estadoSolicitud === 'PENDIENTE' && (
                                                <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger px-4 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
                                                        onClick={() => handleAnularEnvio(solicitud.id)}
                                                    >
                                                        <i className="bi bi-x-circle-fill fs-5" />
                                                        <span>Anular Solicitud</span>
                                                    </button>
                                                </div>
                                            )}
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