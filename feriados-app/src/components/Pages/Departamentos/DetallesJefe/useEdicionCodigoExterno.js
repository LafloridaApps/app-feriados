import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateCodigoExterno } from '../../../../services/departamentosService';

export const useEdicionCodigoExterno = ({ departamento, fetchDepartamentos, setDepartamentoSeleccionado }) => {
    const [codigoExterno, setCodigoExterno] = useState('');
    const [showModalExterno, setShowModalExterno] = useState(false);

    useEffect(() => {
        setCodigoExterno(departamento ? departamento.codigoExterno || '' : '');
    }, [departamento]);

    const handleGuardarCodigoExterno = async () => {
        const result = await Swal.fire({
            title: '¿Está seguro de guardar el código externo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            try {
                await updateCodigoExterno(departamento.id, codigoExterno);

                if (setDepartamentoSeleccionado) {
                    setDepartamentoSeleccionado(null);
                }

                void Swal.fire('¡Guardado!', result.message, 'success');
                void fetchDepartamentos();
            } catch (error) {
                console.log(error);
                const errorMsg = error.response?.data?.message || error.response?.data?.detalle || 'No se pudo guardar.';
                void Swal.fire('Error', errorMsg, 'error');
            }
        }
    };

    return { codigoExterno, setCodigoExterno, showModalExterno, setShowModalExterno, handleGuardarCodigoExterno };
};
