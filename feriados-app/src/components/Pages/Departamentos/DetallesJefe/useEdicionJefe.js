import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getFuncionarioLocalByRut } from '../../../../services/funcionarioService';
import { updateJefeDeptoById } from '../../../../services/departamentosService';
import { validarRut } from '../../../../services/utils';
import { getFotoFuncionario } from '../../../../services/fotoService';

export const useEdicionJefe = ({ departamento, fetchDepartamentos, setDepartamentoSeleccionado }) => {
    const [enEdicion, setEnEdicion] = useState(false);
    const [nombreJefeEditado, setNombreJefeEditado] = useState('');
    const [rutCompleto, setRutCompleto] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [fotoJefe, setFotoJefe] = useState(null);
    const [showBusquedaModal, setShowBusquedaModal] = useState(false);

    useEffect(() => {
        if (departamento) {
            setNombreJefeEditado(departamento.nombreJefe || '');
            setRutCompleto((departamento.rutJefe && departamento.vrutJefe) ? `${departamento.rutJefe}-${departamento.vrutJefe}` : '');
            if (departamento.rutJefe) {
                void cargarFoto(departamento.rutJefe);
            } else {
                setFotoJefe(null);
            }
        } else {
            setNombreJefeEditado('');
            setRutCompleto('');
            setFotoJefe(null);
        }
    }, [departamento]);

    const cargarFoto = async (rut) => {
        try {
            const base64Str = await getFotoFuncionario(rut);
            if (base64Str) {
                setFotoJefe(base64Str.startsWith('data:image') ? base64Str : `data:image/jpeg;base64,${base64Str}`);
            } else {
                setFotoJefe(null);
            }
        } catch (error) {
            console.error('Error al cargar la foto:', error);
            setFotoJefe(null);
        }
    };

    const handleEditar = () => {
        setEnEdicion(true);
    };

    const handleGuardarJefe = async (esRemocion = false) => {
        const accion = esRemocion ? 'dejar este departamento sin jefe' : 'guardar el jefe';
        const txtBoton = esRemocion ? 'quitar jefe' : 'guardar';
        const colorBoton = esRemocion ? '#d33' : '#3085d6';

        const result = await Swal.fire({
            title: `¿Está seguro de ${accion}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Sí, ${txtBoton}`,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: colorBoton,
        });

        if (!result.isConfirmed) return;

        try {
            let rutNumericoFinal = null;

            if (!esRemocion) {
                const partesRut = rutCompleto.split('-');
                rutNumericoFinal = partesRut[0].replaceAll('.', '');
            }

            const resultApi = await updateJefeDeptoById(departamento.id, esRemocion ? 0 : rutNumericoFinal);

            if (setDepartamentoSeleccionado) {
                setDepartamentoSeleccionado(null);
            }

            const mensajeExito = esRemocion ? 'Departamento actualizado sin jefe.' : 'Jefe guardado correctamente.';
            void Swal.fire('¡Éxito!', resultApi.message || mensajeExito, 'success');

            void fetchDepartamentos();
            setEnEdicion(false);
        } catch (error) {
            const accionError = esRemocion ? 'quitar al jefe' : 'guardar';
            void Swal.fire('Error', error.response?.data?.detalle || `No se pudo ${accionError}.`, 'error');
        }
    };

    const handleBuscarJefePorRut = async () => {
        if (!rutCompleto) return;

        if (rutCompleto.includes('.')) {
            void Swal.fire('Error', 'El RUT debe ser ingresado sin puntos.', 'error');
            return;
        }

        const partes = rutCompleto.split('-');
        if (partes.length !== 2 || partes[1].length !== 1) {
            void Swal.fire('Error', 'El RUT debe contener un guión antes del dígito verificador.', 'error');
            return;
        }

        const rutLimpio = rutCompleto.replaceAll('-', '').toUpperCase();

        if (!validarRut(rutLimpio)) {
            void Swal.fire('Error', 'El RUT ingresado no es válido. Verifique el formato y dígito verificador.', 'error');
            setNombreJefeEditado('');
            setDisabled(true);
            return;
        }

        const cuerpo = partes[0];

        try {
            const { data } = await getFuncionarioLocalByRut(cuerpo);
            const nombreCompleto = [data.nombre, data.apellidoPaterno, data.apellidoMaterno].filter(Boolean).join(' ');
            setNombreJefeEditado(nombreCompleto);
            setDisabled(false);
        } catch (error) {
            setDisabled(true);
            void Swal.fire('Error', error.response?.data?.detalle || 'No se pudo obtener el funcionario', 'error');
        }
    };

    const handleCancelar = () => {
        setEnEdicion(false);
        setDisabled(false);
        // Re-inicializar con los datos originales
        if (departamento) {
            setNombreJefeEditado(departamento.nombreJefe || '');
            setRutCompleto((departamento.rutJefe && departamento.vrutJefe) ? `${departamento.rutJefe}-${departamento.vrutJefe}` : '');
        }
    };

    return {
        enEdicion, nombreJefeEditado, setNombreJefeEditado,
        rutCompleto, setRutCompleto, disabled, setDisabled,
        fotoJefe, showBusquedaModal, setShowBusquedaModal,
        handleEditar, handleGuardarJefe, handleBuscarJefePorRut, handleCancelar,
    };
};
