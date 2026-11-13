import { useState } from 'react';
import Swal from 'sweetalert2';
import { useFuncionarioSearch } from '../../../../hooks/useFuncionarioSearch';
import { saveSubrogancia, updateSubrogancia, deleteSubrogancia, consultarCargosCeroPapel, confirmarCargoCeroPapel } from '../../../../services/subroganciaService';

const validarFormulario = ({ editingSubroganciaId, jefe, subrogante, fechaInicio, fechaFin }) => {
    if (!editingSubroganciaId && (!jefe.nombre || !subrogante.nombre)) {
        return { icon: 'warning', title: 'Datos Incompletos', text: 'Debe buscar tanto al jefe como al subrogante.' };
    }
    if (!fechaInicio || !fechaFin) {
        return { icon: 'warning', title: 'Fechas Incompletas', text: 'Seleccione las fechas.' };
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
        return { icon: 'error', title: 'Fechas Inválidas', text: 'La fecha de inicio no puede ser posterior a la fecha de fin.' };
    }
    return null;
};

const mensajeGuardado = (registro, esEdicion) => {
    if (registro?.ceroPapelEstado === 'ENVIADA') {
        return 'Guardada y programada en CeroPapel.';
    }
    if (registro?.ceroPapelEstado === 'DESACTIVADA') {
        return 'Guardada localmente. La integración con Cero Papel está desactivada.';
    }
    if (!esEdicion) {
        return `Guardada localmente. ${registro?.ceroPapelDetalle || 'El envío a CeroPapel no fue confirmado; revise la consola del servidor.'}`;
    }
    return 'Registrada correctamente.';
};

export const useFormularioSubrogancia = ({ setActiveTab, setSearchResults }) => {
    const jefe = useFuncionarioSearch();
    const subrogante = useFuncionarioSearch();
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingSubroganciaId, setEditingSubroganciaId] = useState(null);
    const [editingSubroganciaData, setEditingSubroganciaData] = useState(null);


    const handleEditClick = (sub) => {
        setEditingSubroganciaId(sub.idSubrogancia);
        setEditingSubroganciaData({
            idSubrogancia:  sub.idSubrogancia,
            nombreJefe:     sub.nombreJefe,
            subrogante:     sub.subrogante,
            departamento:   sub.departamento,
            fechaInicio:    sub.fechaInicio,
            fechaFin:       sub.fechaFin,
            rutJefe:        sub.rutJefe,
            vrutJefe:       sub.vrutJefe,
            rutSubrogante:  sub.rutSubrogante,
            vrutSubrogante: sub.vrutSubrogante,
        });
        setFechaInicio(sub.fechaInicio);
        setFechaFin(sub.fechaFin);
        setActiveTab('crear');
    };

    const handleDelete = async (sub) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar subrogancia?',
            text: `${sub.nombreJefe} → ${sub.subrogante}. ${sub.fechaInicio} al ${sub.fechaFin}`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            confirmButtonColor: '#dc3545',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        try {
                await deleteSubrogancia(sub.idSubrogancia);
            await Swal.fire({ icon: 'success', title: 'Eliminada', text: 'La subrogancia fue eliminada correctamente.' });
            setSearchResults(prev => prev.filter(r => r.idSubrogancia !== sub.idSubrogancia));
            if (editingSubroganciaId) cancelEdit();
        } catch (error) {
            console.error(error);
            await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar la subrogancia.' });
        }
    };

    const cancelEdit = () => {
        setEditingSubroganciaId(null);
        setEditingSubroganciaData(null);
        jefe.reset();
        subrogante.reset();
        setFechaInicio('');
        setFechaFin('');
        setActiveTab('buscar');
    };

    const resolverCargoCeroPapel = async (id) => {
        try {
            const opciones = await consultarCargosCeroPapel(id);
            if (!opciones.perfiles?.length) {
                await Swal.fire({ icon: 'warning', title: 'Sin cargos disponibles', text: 'El jefe no tiene cargos activos en CeroPapel. La subrogancia permanece guardada localmente.' });
                return;
            }
            const decision = await Swal.fire({
                icon: 'question',
                title: 'Confirmar cargo de CeroPapel',
                text: `Departamento local: ${opciones.departamento}. Seleccione el cargo que será subrogado. Se guardará la relación para próximos envíos de este departamento.`,
                input: 'select',
                inputOptions: Object.fromEntries(opciones.perfiles.map(p => [String(p.id), `${p.cargo} — ${p.unidad || 'Unidad no informada'}`])),
                inputPlaceholder: 'Seleccione un cargo',
                inputValue: opciones.perfilSugerido ? String(opciones.perfilSugerido) : '',
                inputValidator: value => !value ? 'Debe seleccionar un cargo.' : undefined,
                showCancelButton: true,
                confirmButtonText: 'Confirmar, guardar y enviar',
                cancelButtonText: 'Dejar pendiente',
            });
            if (!decision.isConfirmed) {
                await Swal.fire({ icon: 'info', title: 'Selección pendiente', text: 'La subrogancia sigue guardada localmente. Puede retomarla con “Elegir cargo” en los resultados.' });
                return;
            }
            const registro = await confirmarCargoCeroPapel(id, Number(decision.value));
            setSearchResults(prev => prev.map(r => r.idSubrogancia === id
                ? { ...r, ceroPapelEstado: registro.ceroPapelEstado, ceroPapelDetalle: registro.ceroPapelDetalle, puedeResolverCeroPapel: registro.ceroPapelEstado === 'PENDIENTE_PERFIL' }
                : r));
            const enviada = registro.ceroPapelEstado === 'ENVIADA';
            await Swal.fire({
                icon: enviada ? 'success' : 'warning',
                title: enviada ? 'Programada en CeroPapel' : 'Envío sin confirmar',
                text: enviada
                    ? 'El cargo fue confirmado y la subrogancia quedó programada.'
                    : `La subrogancia está guardada localmente. ${registro.ceroPapelDetalle || 'Revise el resultado en la consola del servidor.'}`,
            });
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'No se pudo confirmar el cargo', text: error.response?.data?.message || 'No se pudo consultar o confirmar en CeroPapel. El registro local se conserva.' });
        }
    };

    const crearDatosSubrogancia = () => {
        if (editingSubroganciaId) {
            return {
                rutJefe: editingSubroganciaData.rutJefe,
                rutSubrogante: editingSubroganciaData.rutSubrogante,
                fechaInicio,
                fechaFin,
            };
        }
        return {
            rutJefe: jefe.rutSinDV,
            rutSubrogante: subrogante.rutSinDV,
            fechaInicio,
            fechaFin,
            idDepto: jefe.idDepto,
        };
    };

    const informarResultado = async (registro) => {
        if (registro?.ceroPapelEstado === 'PENDIENTE_PERFIL') {
            await resolverCargoCeroPapel(registro.id);
            return;
        }
        const desactivada = registro?.ceroPapelEstado === 'DESACTIVADA';
        const errorEnvio = !editingSubroganciaId && !desactivada && registro?.ceroPapelEstado !== 'ENVIADA';
        await Swal.fire({
            icon: errorEnvio ? 'warning' : 'success',
            title: editingSubroganciaId ? 'Cambios Guardados' : 'Subrogancia Guardada',
            text: mensajeGuardado(registro, Boolean(editingSubroganciaId)),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorValidacion = validarFormulario({
            editingSubroganciaId, jefe, subrogante, fechaInicio, fechaFin,
        });
        if (errorValidacion) {
            await Swal.fire(errorValidacion);
            return;
        }

        setIsSaving(true);
        try {
            const datos = crearDatosSubrogancia();
            const response = editingSubroganciaId
                ? await updateSubrogancia(editingSubroganciaId, datos)
                : await saveSubrogancia(datos);
            if (!response || response.status < 200 || response.status >= 300) {
                throw new Error(response?.data?.message || 'Error en validación.');
            }
            await informarResultado(response.data);
            cancelEdit();
        } catch (error) {
            console.error(error);
            const apiMessage = error.response?.data?.message;
            await Swal.fire({
                icon: 'error',
                title: 'Error al Guardar',
                text: apiMessage || error.message || 'No se pudo guardar la subrogancia.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getSubmitButtonText = () => {
        if (isSaving) return 'Guardando...';
        if (editingSubroganciaId) return 'Guardar Cambios';
        return 'Guardar Subrogancia';
    };

    return {
        jefe, subrogante,
        fechaInicio, setFechaInicio, fechaFin, setFechaFin,
        isSaving, setIsSaving, resolverCargoCeroPapel, editingSubroganciaId, editingSubroganciaData,
        handleEditClick, handleDelete, cancelEdit, handleSubmit, getSubmitButtonText,
    };
};
