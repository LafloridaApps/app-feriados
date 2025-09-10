import Swal from 'sweetalert2';
import { saveEntrada } from '../services/entradaService';
import { saveDerivacion } from '../services/derivacionService';
import { saveAprobacion } from '../services/aprobacionService';

export const useAccionesSolicitud = (rutFuncionario, onActualizarSolicitud, refetch) => {


    const handlerEntrada = async (idDerivacion) => {
        const entrada = {
            idDerivacion,
            rutFuncionario,
        };


        const result = await Swal.fire({
            title: '¿Estás seguro de que quieres Recibir esta solicitud?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, recibir',
        });

        if (result.isConfirmed) {
            try {
                await saveEntrada(entrada);
                Swal.fire('¡Recibida!', 'La solicitud ha sido recibida.', 'success');
                onActualizarSolicitud();
                refetch();
            } catch (error) {
                console.log(error);
                Swal.fire('¡Error!', 'Error al recibir: ' + error?.data || error, 'error');
            }
        }
    };

    const handlerVisar = async (idDerivacion) => {
        const result = await Swal.fire({
            title: '¿Estás seguro de que quieres visar esta solicitud?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, visar',
        });

        if (result.isConfirmed) {
            try {
                await saveDerivacion(idDerivacion, rutFuncionario);
                Swal.fire('¡Visado!', 'La solicitud ha sido visada.', 'success');
                onActualizarSolicitud();
            } catch (error) {
                Swal.fire('¡Error!', 'Error al visar: ' + error?.response?.data.message || error, 'error');
            }
        }
    };

    const handlerAprobar = async (idDerivacion) => {
        const result = await Swal.fire({
            title: '¿Quieres firmar esta solicitud?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, firmar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Firmando tu documento digitalmente',
                text: 'Esto puede tardar unos minutos...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const aprobacion = {
                    idDerivacion: idDerivacion,
                    aprobadoPor: rutFuncionario,
                };
                await saveAprobacion(aprobacion);
                Swal.fire('¡Firmado!', 'La solicitud ha sido firmada digitalmente.', 'success');
                onActualizarSolicitud();
            } catch (error) {
                Swal.fire('¡Error!', 'Error al firmar: ' + (error?.response?.data?.message || error.message || 'Error desconocido'), 'error');
            }
        }
    };

    return {
        handlerEntrada,
        handlerVisar,
        handlerAprobar,
    };
};
