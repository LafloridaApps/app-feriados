import Swal from 'sweetalert2';
import { deleteCodigoExternoByIdDepto } from '../../../../services/departamentosService';

export const useEliminacionDepto = ({ departamento, setDepartamentoSeleccionado }) => {
    const handlerEliminar = async () => {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: 'Se eliminará el código externo del departamento.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            try {
                const response = await deleteCodigoExternoByIdDepto(departamento.id);
                void Swal.fire('Eliminado', response.message, 'success');
                if (setDepartamentoSeleccionado) {
                    setDepartamentoSeleccionado(null);
                }
            } catch (error) {
                void Swal.fire('Error', error.response?.data?.detalle || 'No se pudo eliminar el código externo.', 'error');
            }
        }
    }

    return { handlerEliminar };
};
