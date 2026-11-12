import { useState } from 'react';
import Swal from 'sweetalert2';
import { useFuncionarioSearch } from '../../../../hooks/useFuncionarioSearch';
import { saveSubrogancia, updateSubrogancia, deleteSubrogancia, consultarCargosCeroPapel, confirmarCargoCeroPapel } from '../../../../services/subroganciaService';

export const useFormularioSubrogancia = ({ setActiveTab, setSearchResults }) => {
    // Form Create State
    const jefe = useFuncionarioSearch();
    const subrogante = useFuncionarioSearch();
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingSubroganciaId, setEditingSubroganciaId] = useState(null);
    const [editingSubroganciaData, setEditingSubroganciaData] = useState(null);


    const handleEditClick = (sub) => {
        // Usar idSubrogancia como identificador
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
            html: `<b>${sub.nombreJefe}</b> → ${sub.subrogante}<br/><small>${sub.fechaInicio} al ${sub.fechaFin}</small>`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            confirmButtonColor: '#dc3545',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        try {
            // Usar idSubrogancia como identificador
            await deleteSubrogancia(sub.idSubrogancia);
            void Swal.fire({ icon: 'success', title: 'Eliminada', text: 'La subrogancia fue eliminada correctamente.' });
            setSearchResults(prev => prev.filter(r => r.idSubrogancia !== sub.idSubrogancia));
            if (editingSubroganciaId) cancelEdit();
        } catch (error) {
            console.error(error);
            void Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar la subrogancia.' });
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
            await Swal.fire({
                icon: registro.ceroPapelEstado === 'ENVIADA' ? 'success' : 'warning',
                title: registro.ceroPapelEstado === 'ENVIADA' ? 'Programada en CeroPapel' : 'Envío sin confirmar',
                text: registro.ceroPapelEstado === 'ENVIADA'
                    ? 'El cargo fue confirmado y la subrogancia quedó programada.'
                    : `La subrogancia está guardada localmente. ${registro.ceroPapelDetalle || 'Revise el resultado en la consola del servidor.'}`,
            });
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'No se pudo confirmar el cargo', text: error.response?.data?.message || 'No se pudo consultar o confirmar en CeroPapel. El registro local se conserva.' });
        }
    };

    // Handlers Create
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // En edici\u00f3n los datos vienen de editingSubroganciaData, no de los hooks de b\u00fasqueda
        if (!editingSubroganciaId && (!jefe.nombre || !subrogante.nombre)) {
            void Swal.fire({ icon: 'warning', title: 'Datos Incompletos', text: 'Debe buscar tanto al jefe como al subrogante.' });
            setIsSaving(false); return;
        }
        if (!fechaInicio || !fechaFin) {
            void Swal.fire({ icon: 'warning', title: 'Fechas Incompletas', text: 'Seleccione las fechas.' });
            setIsSaving(false); return;
        }
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            void Swal.fire({ icon: 'error', title: 'Fechas Inválidas', text: 'La fecha de inicio no puede ser posterior a la fecha de fin.' });
            setIsSaving(false); return;
        }

        // En modo edición: enviar rutJefe, rutSubrogante y las nuevas fechas
        const subroganciaData = editingSubroganciaId
            ? {
                rutJefe:       editingSubroganciaData.rutJefe,
                rutSubrogante: editingSubroganciaData.rutSubrogante,
                fechaInicio,
                fechaFin,
            }
            : {
                rutJefe: jefe.rutSinDV,
                rutSubrogante: subrogante.rutSinDV,
                fechaInicio,
                fechaFin,
                idDepto: jefe.idDepto
            };

        try {
            if (!editingSubroganciaId) {
                const decision = await Swal.fire({
                    icon: 'question',
                    title: '¿Registrar también en CeroPapel?',
                    text: 'Puede guardar solo en este sistema o solicitar también el registro en CeroPapel (ambiente de prueba).',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Sí, también en CeroPapel',
                    denyButtonText: 'Solo en este sistema',
                    cancelButtonText: 'Volver',
                });
                if (!decision.isConfirmed && !decision.isDenied) return;
                subroganciaData.grabarCeroPapel = decision.isConfirmed;
            }
            let response;
            if (editingSubroganciaId) {
                response = await updateSubrogancia(editingSubroganciaId, subroganciaData);
            } else {
                response = await saveSubrogancia(subroganciaData);
            }
            if (response && response.status >= 200 && response.status < 300) {
                if (response.data?.ceroPapelEstado === 'PENDIENTE_PERFIL') {
                    await resolverCargoCeroPapel(response.data.id);
                } else {
                    const enviada = response.data?.ceroPapelEstado === 'ENVIADA';
                    const errorEnvio = subroganciaData.grabarCeroPapel && !enviada;
                    await Swal.fire({
                        icon: errorEnvio ? 'warning' : 'success',
                        title: editingSubroganciaId ? 'Cambios Guardados' : 'Subrogancia Guardada',
                        text: enviada ? 'Guardada y programada en CeroPapel.' : errorEnvio
                            ? `Guardada localmente. ${response.data?.ceroPapelDetalle || 'El envío a CeroPapel no fue confirmado; revise la consola del servidor.'}`
                            : 'Registrada correctamente.',
                    });
                }
                jefe.reset(); subrogante.reset(); setFechaInicio(''); setFechaFin('');
                setEditingSubroganciaId(null);
                setEditingSubroganciaData(null);
                setActiveTab('buscar');
            } else {
                throw new Error(response?.data?.message || 'Error en validación.');
            }
        } catch (error) {
            console.error(error);
            const apiMessage = error.response?.data?.message;
            void Swal.fire({ icon: 'error', title: 'Error al Guardar', text: apiMessage || error.message || 'No se pudo guardar la subrogancia.' });
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
