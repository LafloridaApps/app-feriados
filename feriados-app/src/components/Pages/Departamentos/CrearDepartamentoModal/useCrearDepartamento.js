import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getFuncionarioLocalByRut } from '../../../../services/funcionarioService';
import { agregarDepartamento } from '../../../../services/departamentosService';
import { validarRut } from '../../../../services/utils';

export const useCrearDepartamento = ({ show, onHide, parent, fetchDepartamentos }) => {
    const [nombre, setNombre] = useState('');
    const [rutCompleto, setRutCompleto] = useState('');
    const [nombreJefe, setNombreJefe] = useState('');
    const [isSaveDisabled, setSaveDisabled] = useState(true);
    const [showBuscarNombre, setShowBuscarNombre] = useState(false);

    useEffect(() => {
        if (show) {
            // Resetear estado cuando el modal se muestra
            setNombre('');
            setRutCompleto('');
            setNombreJefe('');
            setSaveDisabled(true);
        }
    }, [show]);

    useEffect(() => {
        // Habilitar el botón de guardar solo si el nombre del depto no está vacío
        setSaveDisabled(!nombre.trim());
    }, [nombre]);

    const handlerOnBlurRut = async () => {
        if (!rutCompleto.trim()) {
            setNombreJefe('');
            return;
        }

        if (rutCompleto.includes('.')) {
            void Swal.fire('Error', 'El RUT debe ser ingresado sin puntos.', 'error');
            setNombreJefe('');
            return;
        }

        const partes = rutCompleto.split('-');
        if (partes.length !== 2 || partes[1].length !== 1) {
            void Swal.fire('Error', 'El RUT debe contener un guión antes del dígito verificador.', 'error');
            setNombreJefe('');
            return;
        }

        const rutLimpio = rutCompleto.replaceAll('-', '').toUpperCase();

        if (!validarRut(rutLimpio)) {
            void Swal.fire('Error', 'El RUT ingresado no es válido. Verifique el formato y dígito verificador.', 'error');
            setNombreJefe('');
            return;
        }

        const cuerpo = partes[0];

        try {
            const { data } = await getFuncionarioLocalByRut(cuerpo);
            const nombreEncontrado = [data.nombre, data.apellidoPaterno, data.apellidoMaterno].filter(Boolean).join(' ');
            setNombreJefe(nombreEncontrado);
        } catch (error) {
            setNombreJefe('');
            void Swal.fire('Error', error.response?.data?.detalle || 'No se pudo encontrar al funcionario.', 'error');
        }
    };

    const handleGuardar = async () => {
        // Validación final de campos antes del confirm
        if (!nombre.trim()) {
            void Swal.fire('Error', 'Debe ingresar un nombre para el departamento.', 'error');
            return;
        }

        let rutJefeNumerico = null;
        if (rutCompleto) {
            const rutLimpio = rutCompleto.replaceAll('-', '').toUpperCase();
            if (!validarRut(rutLimpio) || !nombreJefe) {
                void Swal.fire('Error', 'El RUT del jefe ingresado no es válido o no ha sido encontrado.', 'error');
                return;
            }
            rutJefeNumerico = Number(rutCompleto.split('-')[0]);
        }

        // Mensaje de confirmación dinámico
        const textoConfirmacion = rutJefeNumerico 
            ? `Se creará el departamento "${nombre}" con jefatura asignada.`
            : `Está a punto de crear el departamento "${nombre}" SIN jefatura asignada. ¿Desea continuar de todos modos?`;

        const result = await Swal.fire({
            title: '¿Confirmar creación?',
            text: textoConfirmacion,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, crear',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const deptoData = {
                idPadre: parent ? parent.id : null,
                nombreDepartamento: nombre,
                rutJefe: rutJefeNumerico
            };

            try {
                const response = await agregarDepartamento(deptoData);
                void Swal.fire('¡Éxito!', response.message || 'Departamento agregado con éxito.', 'success');
                void fetchDepartamentos();
                onHide();
            } catch (error) {
                void Swal.fire('Error', error.response?.data?.detalle || 'No se pudo crear el departamento.', 'error');
            }
        }
    };

    return {
        nombre,
        setNombre,
        rutCompleto,
        setRutCompleto,
        nombreJefe,
        setNombreJefe,
        isSaveDisabled,
        showBuscarNombre,
        setShowBuscarNombre,
        handlerOnBlurRut,
        handleGuardar
    };
};
