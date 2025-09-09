import Swal from 'sweetalert2';
import { savePostergacion } from '../services/postergacionService';
import { useAlertaSweetAlert } from './useAlertaSweetAlert';

export const usePostergacion = (solicitud, rutFuncionario, onActualizarSolicitud) => {
    const { mostrarAlertaError, mostrarAlertaExito } = useAlertaSweetAlert();

    const handlePostergar = () => {
        Swal.fire({
            title: '¿Está seguro de postergar?',
            text: "Por favor, ingrese el motivo de la postergación:",
            input: 'textarea',
            inputPlaceholder: 'Escriba el motivo aquí...',
            showCancelButton: true,
            confirmButtonText: 'Sí, postergar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return '¡Necesita escribir un motivo!';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    const datosPostergacion = {
                        idSolicitud: solicitud.id,
                        motivo: result.value,
                        postergadoPor: rutFuncionario
                    };
                    await savePostergacion(datosPostergacion);
                    mostrarAlertaExito('Éxito', 'La solicitud ha sido postergada correctamente.');
                    onActualizarSolicitud();
                } catch (error) {
                    console.error('Error al postergar la solicitud:', error);
                    mostrarAlertaError('No se pudo postergar la solicitud.');
                }
            }
        });
    };

    return { handlePostergar };
};