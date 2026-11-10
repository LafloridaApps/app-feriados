import { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { UsuarioContext } from '../../../../context/UsuarioContext';
import { useGestionSolicitudes } from '../../../../hooks/useGestionSolicitudes';

export const useVisorSolicitudes = () => {
    const funcionario = useContext(UsuarioContext);
    const [solicitudId, setSolicitudId] = useState('');
    const {
        solicitud, loading, error,
        buscarSolicitud, limpiarSolicitud, handleAnularDirecto
    } = useGestionSolicitudes();

    const handleSearch = (e) => {
        e.preventDefault();
        if (solicitudId) {
            void buscarSolicitud(solicitudId);
        }
    };

    const handleAnular = async () => {
        const idSol = solicitud.id || solicitud.idSolicitud;
        const result = await Swal.fire({
            title: '¿Anular Solicitud?',
            html: `¿Está seguro de que desea anular la solicitud <strong>#${idSol}</strong>?<br><br>Por favor, ingrese el motivo (glosa) para dejar constancia:`,
            input: 'textarea',
            inputPlaceholder: 'Ej: Solicitud duplicada, error en fechas...',
            inputAttributes: { rows: 4, maxlength: 300 },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="bi bi-x-circle me-1"></i> Sí, anular',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value?.trim()) return 'Debe ingresar un motivo para anular.';
            }
        });

        if (result.isConfirmed && result.value) {
            const rutAprobador = funcionario?.rut ? Number.parseInt(String(funcionario.rut).split('-')[0].replaceAll('.', ''), 10) : 0;
            await handleAnularDirecto(idSol, result.value.trim(), rutAprobador);
        }
    };

    return {
        solicitudId, setSolicitudId, solicitud, loading, error,
        handleSearch, handleAnular, buscarSolicitud, limpiarSolicitud,
    };
};
