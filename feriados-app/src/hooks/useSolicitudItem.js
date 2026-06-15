import Swal from 'sweetalert2';
import { useGestionAcciones } from './useGestionAcciones';
import { usePostergacion } from './usePostergacion';
import { resolverAnulacion } from '../services/anulacionService';

export const getStatusBadge = (status, isMobile = false) => {
    const s = (status || '').trim().toUpperCase();
    const padding = isMobile ? 'px-3' : 'px-3 py-2';
    
    switch (s) {
        case 'APROBADA': return `badge bg-success bg-opacity-10 text-success border border-success-subtle rounded-pill ${padding}`;
        case 'POSTERGADA': return `badge bg-warning bg-opacity-10 text-dark border border-warning-subtle rounded-pill ${padding}`;
        case 'PENDIENTE':
        case 'PENDIENTE VISACION': return `badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-pill ${padding}`;
        case 'FINALIZADA': return `badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle rounded-pill ${padding}`;
        case 'ANULADA':
        case 'RECHAZADA': return `badge bg-danger bg-opacity-10 text-danger border border-danger-subtle rounded-pill ${padding}`;
        default: return `badge bg-light text-dark border rounded-pill ${padding}`;
    }
};

export const useSolicitudItem = (solicitud, rutFuncionario, onActualizarSolicitud) => {
    const handleVerAnulacion = async () => {
        const { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: '⚠️ Anulación Pendiente',
            html: `
                <p>El solicitante <strong>${solicitud.nombreFuncionario}</strong> ha solicitado la <strong>anulación</strong> de esta solicitud.</p>
                <p class="text-muted small mb-0">¿Desea aprobar la solicitud de anulación?</p>
            `,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-check-circle-fill"></i> Aprobar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#16a34a',
            reverseButtons: true,
        });

        if (!isConfirmed) return;

        try {
            const respuesta = await resolverAnulacion(solicitud.id, rutFuncionario, true);
            const mensaje = respuesta?.message || respuesta?.mensaje || 'Anulación aprobada correctamente.';
            await Swal.fire({
                icon: 'success',
                title: '✅ Anulación aprobada',
                text: mensaje,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#16a34a',
            });
            onActualizarSolicitud?.();
        } catch (error) {
            const mensajeError = error.response?.data?.message || error.response?.data?.mensaje || error.message || 'No se pudo procesar la solicitud de anulación.';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensajeError,
            });
        }
    };

    const acciones = useGestionAcciones(solicitud.derivaciones?.[0]);
    const { handlePostergar } = usePostergacion(solicitud, rutFuncionario, onActualizarSolicitud);

    const isSubrogada = solicitud.subroganciaInfo && solicitud.subroganciaInfo.length > 0;
    const subroganciaText = isSubrogada ? `(Subrogando a ${solicitud.subroganciaInfo[0].nombreDeptoSubrogado})` : '';
    const esNoLeida = solicitud.derivaciones?.[0]?.recepcionada === false && solicitud.estadoSolicitud !== 'ANULADA';

    return {
        handleVerAnulacion,
        acciones,
        handlePostergar,
        isSubrogada,
        subroganciaText,
        esNoLeida
    };
};