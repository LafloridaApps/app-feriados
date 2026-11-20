export const getStatusBadge = (status) => {
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

export function getEtapaActual(solicitud) {
    const eventos = solicitud.trazabilidad ?? [];
    if (eventos.some(evento => evento.accion === 'Solicitud de anulación')) {
        return 'Anulación pendiente de aprobación';
    }
    if (!['PENDIENTE', 'PENDIENTE VISACION'].includes(solicitud.estadoSolicitud)) return null;

    const etapa = eventos.findLast(evento => ['PENDIENTE', 'RECIBIDO'].includes(evento.estado));
    if (!etapa) return null;
    const accion = etapa.accion === 'Aprobación' ? 'Pendiente de firma' : 'Pendiente de visación';
    return etapa.departamento ? `${accion} · ${etapa.departamento}` : accion;
}
