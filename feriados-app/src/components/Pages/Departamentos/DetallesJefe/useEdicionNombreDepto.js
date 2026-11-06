import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateNombreDeptoById } from '../../../../services/departamentosService';

export const useEdicionNombreDepto = ({ departamento, fetchDepartamentos, setDepartamentoSeleccionado }) => {
    const [nombreDepartamento, setNombreDepartamento] = useState('');

    useEffect(() => {
        setNombreDepartamento(departamento ? departamento.nombre || '' : '');
    }, [departamento]);

    const handleGuardarNombreDepartamento = async () => {
        const result = await Swal.fire({
            title: '¿Está seguro de actualizar el nombre del departamento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            try {
                await updateNombreDeptoById(departamento.id, nombreDepartamento);

                if (setDepartamentoSeleccionado) {
                    setDepartamentoSeleccionado(null);
                }

                void Swal.fire('¡Guardado!', 'El nombre del departamento ha sido actualizado.', 'success');
                void fetchDepartamentos();
            } catch (error) {
                void Swal.fire('Error', error.response?.data?.detalle || 'No se pudo actualizar el nombre del departamento.', 'error');
            }
        } else {
            setNombreDepartamento(departamento.nombre || '');
        }
    };

    return { nombreDepartamento, setNombreDepartamento, handleGuardarNombreDepartamento };
};
