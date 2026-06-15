import React from 'react';
import Swal from 'sweetalert2';
import DetalleMiSolicitud from './DetalleMiSolicitud';
import { formatFecha } from '../../../services/utils';
import { anularSolicitud } from '../../../services/anulacionService';
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
        case 'ANULADA':
            return 'badge-premium status-anulada';
        default:
            return 'badge-premium status-finalizada';
    }
};

const MisSolicitudesMobile = ({ solicitudes, openDetailId, handleToggleDetail }) => {

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
                timer: 2500,
                showConfirmButton: false,
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
        <div className="mis-solicitudes-mobile-list">
            {solicitudes.map((solicitud, index) => (
                <div key={solicitud?.id || index} className={`mis-solicitudes-mobile-card ${solicitud.tipoSolicitud?.includes('FERIADO') ? 'feriado' : 'administrativo'}`}>
                    <div className="mis-solicitudes-mobile-card-header">
                        <div className="d-flex flex-column">
                            <span className="mis-solicitudes-mobile-type">{solicitud.tipoSolicitud || 'Solicitud'}</span>
                            <span className="mis-solicitudes-mobile-id">ID #{solicitud?.id || 'N/A'}</span>
                        </div>
                        <span className={getStatusBadge(solicitud.estadoSolicitud)}>
                            {solicitud.estadoSolicitud || 'No especificado'}
                        </span>
                    </div>
                    <div className="mis-solicitudes-mobile-card-body">
                        <div className="mis-solicitudes-mobile-card-info">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="mis-solicitudes-mobile-card-item mb-0">
                                    <i className="bi bi-clock-history"></i>
                                    <span className="label">Duración:</span>
                                    <span className="badge bg-light text-dark border rounded-pill px-3">
                                        {solicitud?.cantidadDias || solicitud?.diasSolicitados || '0'} días
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
                    </div>
                    {openDetailId === solicitud.id && (
                        <div className="p-3 bg-light rounded-bottom">
                            <div className="pt-2">
                                <DetalleMiSolicitud solicitud={solicitud} />
                            </div>
                            {solicitud?.estadoSolicitud === 'PENDIENTE' && (
                                <div className="mt-3 pt-3 border-top">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100 rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                                        onClick={() => handleAnularEnvio(solicitud.id)}
                                    >
                                        <i className="bi bi-x-circle-fill fs-5" />
                                        <span>Anular Solicitud</span>
                                    </button>
                                </div>
                            )}
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
