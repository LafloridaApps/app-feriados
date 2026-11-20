import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { formatFecha } from '../../../services/utils';
import { anularSolicitud } from '../../../services/anulacionService';
import { getStatusBadge } from './estadoSolicitud';

const ICONOS = {
    'Creación': 'bi-send',
    'Visación': 'bi-check-circle',
    'Aprobación': 'bi-pen',
    'Postergación': 'bi-clock-history',
    'Anulación': 'bi-slash-circle',
    'Solicitud de anulación': 'bi-hourglass-split',
};

function obtenerEstadoRecepcion(recepcion, solicitudAnulada) {
    if (recepcion?.recepcionada === true) {
        return 'Recepcionada';
    }
    if (recepcion?.recepcionada === false) {
        if (solicitudAnulada) {
            return 'Sin recepción registrada';
        }
        return 'Pendiente de recepción';
    }
    return 'Sin información de recepción';
}

function obtenerTituloEvento(accion, esDerivacion) {
    if (esDerivacion) {
        return `Derivada para ${accion.toLowerCase()}`;
    }
    if (accion === 'Creación') {
        return 'Solicitud enviada';
    }
    return accion;
}

function EventoTrazabilidad({ evento, solicitudAnulada }) {
    const { accion, fecha, usuario, departamento, recepcion, firma, glosa } = evento;
    const esDerivacion = accion === 'Visación' || accion === 'Aprobación';
    const estadoRecepcion = obtenerEstadoRecepcion(recepcion, solicitudAnulada);

    return (
        <li className="timeline-item-premium">
            <div className="timeline-dot" aria-hidden="true">
                <i className={`bi ${ICONOS[accion] ?? 'bi-info-lg'}`} />
            </div>
            <div className="timeline-content-card">
                <div className="timeline-title d-flex justify-content-between flex-wrap gap-1">
                    <span>{obtenerTituloEvento(accion, esDerivacion)}</span>
                    {fecha && <span className="small text-muted fw-normal">{formatFecha(fecha)}</span>}
                </div>
                <div className="timeline-meta">
                    {departamento && <div>{departamento}</div>}
                    {!esDerivacion && usuario && <div>{usuario}</div>}
                    {esDerivacion && (
                        <div className="mt-2 border-top pt-2">
                            <strong>{estadoRecepcion}</strong>
                            {recepcion?.responsable && <span> · {recepcion.responsable}</span>}
                            {recepcion?.fecha && <span> · {formatFecha(recepcion.fecha)}</span>}
                        </div>
                    )}
                    {firma && (
                        <div className="mt-2 border-top pt-2">
                            <strong>Firmada por {firma.firmante || 'una persona sin identificar'}</strong>
                            {firma.fecha && <span> · {formatFecha(firma.fecha)}</span>}
                            {firma.titularSubrogado && <div>Como subrogante de {firma.titularSubrogado}</div>}
                        </div>
                    )}
                    {esDerivacion && !firma && evento.estado === 'REALIZADO' && (
                        <div className="mt-2">{accion === 'Visación' ? 'Visación realizada' : 'Aprobación registrada'}</div>
                    )}
                    {esDerivacion && !firma && evento.estado === 'RECIBIDO' && !solicitudAnulada && (
                        <div className="mt-2">{accion === 'Visación' ? 'Pendiente de visación' : 'Pendiente de firma'}</div>
                    )}
                    {glosa && <div className="mt-2 border-top pt-2"><strong>Motivo</strong> <span>{glosa}</span></div>}
                </div>
            </div>
        </li>
    );
}

EventoTrazabilidad.propTypes = {
    evento: PropTypes.shape({
        accion: PropTypes.string,
        fecha: PropTypes.string,
        usuario: PropTypes.string,
        departamento: PropTypes.string,
        estado: PropTypes.string,
        glosa: PropTypes.string,
        recepcion: PropTypes.shape({
            recepcionada: PropTypes.bool,
            responsable: PropTypes.string,
            fecha: PropTypes.string,
        }),
        firma: PropTypes.shape({
            firmante: PropTypes.string,
            titularSubrogado: PropTypes.string,
            fecha: PropTypes.string,
        }),
    }).isRequired,
    solicitudAnulada: PropTypes.bool.isRequired,
};

export default function DetalleMiSolicitud({ solicitud, urlPdf, onAnulada }) {
    const [anulando, setAnulando] = useState(false);
    const historial = solicitud.trazabilidad ?? [];
    const anulada = solicitud.estadoSolicitud === 'ANULADA';
    const eventos = [{ accion: 'Creación', fecha: solicitud.fechaSolicitud }, ...historial];

    if (anulada && !historial.some(evento => evento.accion === 'Anulación')) {
        eventos.push({ accion: 'Anulación', glosa: solicitud.motivoAnulacion });
    }
    const anulacionPendiente = historial.some(evento => evento.accion === 'Solicitud de anulación');
    const puedeAnular = Boolean(onAnulada && solicitud.id) && solicitud.estadoSolicitud === 'PENDIENTE' && !anulacionPendiente;

    const confirmarAnulacion = async () => {
        setAnulando(true);
        const { isConfirmed, value: motivo } = await Swal.fire({
            icon: 'warning',
            title: `¿Anular la solicitud #${solicitud.id}?`,
            input: 'textarea',
            inputLabel: 'Motivo de anulación',
            inputAttributes: { maxlength: '300', rows: '4' },
            showCancelButton: true,
            focusCancel: true,
            reverseButtons: true,
            confirmButtonColor: '#b91c1c',
            confirmButtonText: 'Confirmar anulación',
            cancelButtonText: 'Mantener solicitud',
            inputValidator: value => value.trim().length < 10 ? 'Ingresa un motivo de al menos 10 caracteres.' : undefined,
        });
        if (!isConfirmed) {
            setAnulando(false);
            return;
        }
        try {
            const respuesta = await anularSolicitud(solicitud.id, motivo.trim());
            const requiereAprobacion = respuesta?.status === 'REQUIERE_APROBACION';
            await Swal.fire({
                icon: 'success',
                title: requiereAprobacion ? 'Anulación solicitada' : 'Solicitud anulada',
                text: respuesta?.message ?? respuesta?.mensaje,
            });
            onAnulada();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'No se pudo anular la solicitud',
                text: error.response?.data?.message ?? error.response?.data?.mensaje ?? error.message,
            });
        } finally {
            setAnulando(false);
        }
    };

    const fechaFin = solicitud.fechaFin ?? solicitud.fechaTermino;
    return (
        <section className="mis-solicitudes-detalle bg-white rounded-3 border">
            <header className="p-3 p-md-4 border-bottom">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <h3 className="h5 mb-0">Solicitud #{solicitud.id}</h3>
                        <span className={getStatusBadge(solicitud.estadoSolicitud)}>{solicitud.estadoSolicitud}</span>
                    </div>
                    {urlPdf && (
                        <a className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
                            href={urlPdf} target="_blank" rel="noopener noreferrer"
                            aria-label="Abrir PDF de la solicitud en una pestaña nueva">
                            <i className="bi bi-file-earmark-pdf" aria-hidden="true" />{' '}
                            Abrir PDF{' '}
                            <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                        </a>
                    )}
                </div>
                <dl className="d-flex gap-3 gap-md-4 flex-wrap mt-3 mb-0">
                    <div>
                        <dt className="small text-muted">Tipo de permiso</dt>
                        <dd className="mb-0">{solicitud.tipoSolicitud}</dd>
                    </div>
                    <div>
                        <dt className="small text-muted">Desde</dt>
                        <dd className="mb-0">{solicitud.fechaInicio ? formatFecha(solicitud.fechaInicio) : '—'}</dd>
                    </div>
                    <div>
                        <dt className="small text-muted">Hasta</dt>
                        <dd className="mb-0">{fechaFin ? formatFecha(fechaFin) : '—'}</dd>
                    </div>
                    <div>
                        <dt className="small text-muted">Días solicitados</dt>
                        <dd className="mb-0">{solicitud.cantidadDias ?? solicitud.diasSolicitados ?? '—'}</dd>
                    </div>
                </dl>
            </header>
            <div className="p-3 p-md-4">
                <h4 className="h6 fw-bold mb-3">Trazabilidad</h4>
                <ol className="timeline-premium list-unstyled mb-0">
                    {eventos.map((evento, index) => (
                        <EventoTrazabilidad key={evento.id ?? `${evento.accion}-${index}`} evento={evento} solicitudAnulada={anulada} />
                    ))}
                </ol>
            </div>
            {puedeAnular && (
                <footer className="mis-solicitudes-detalle-acciones border-top p-3 p-md-4 d-flex justify-content-end">
                    <button type="button" className="btn btn-outline-danger" disabled={anulando} onClick={confirmarAnulacion}>
                        <i className="bi bi-x-circle me-2" aria-hidden="true" />
                        {anulando ? 'Procesando…' : 'Anular solicitud'}
                    </button>
                </footer>
            )}
        </section>
    );
}

DetalleMiSolicitud.propTypes = {
    solicitud: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tipoSolicitud: PropTypes.string,
        fechaSolicitud: PropTypes.string,
        fechaInicio: PropTypes.string,
        fechaFin: PropTypes.string,
        fechaTermino: PropTypes.string,
        cantidadDias: PropTypes.number,
        diasSolicitados: PropTypes.number,
        estadoSolicitud: PropTypes.string,
        motivoAnulacion: PropTypes.string,
        trazabilidad: PropTypes.arrayOf(EventoTrazabilidad.propTypes.evento),
    }).isRequired,
    urlPdf: PropTypes.string,
    onAnulada: PropTypes.func,
};
