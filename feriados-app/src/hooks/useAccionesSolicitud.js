import Swal from 'sweetalert2';
import { saveEntrada } from '../services/entradaService';
import { saveDerivacion } from '../services/derivacionService';
import { saveAprobacion } from '../services/aprobacionService';

export const useAccionesSolicitud = (rutFuncionario, onActualizarSolicitud, refetch ) => {


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
            title: '¿Quieres visar esta solicitud?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, visar',
        });

        if (result.isConfirmed) {
            try {
                await saveDerivacion(idDerivacion);
                Swal.fire('¡Visado!', 'La solicitud ha sido visada.', 'success');
                onActualizarSolicitud();
            } catch (error) {
                Swal.fire('¡Error!', 'Error al visar: ' + error?.data || error, 'error');
            }
        }
    };

    const handlerAprobar = async (idDerivacion) => {
        const result = await Swal.fire({
            title: '¿Quieres aprobar esta solicitud?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
        });

        if (result.isConfirmed) {
            try {
                await saveAprobacion({ idDerivacion });
                Swal.fire('¡Aprobado!', 'La solicitud ha sido aprobada.', 'success');
                onActualizarSolicitud();
            } catch (error) {
                Swal.fire('¡Error!', 'Error al aprobar: ' + error?.data || error, 'error');
            }
        }
    };

    return {
        handlerEntrada,
        handlerVisar,
        handlerAprobar
    };
};
