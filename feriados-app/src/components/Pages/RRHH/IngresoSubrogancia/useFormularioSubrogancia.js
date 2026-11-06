import { useState } from 'react';
import Swal from 'sweetalert2';
import { useFuncionarioSearch } from '../../../../hooks/useFuncionarioSearch';
import { saveSubrogancia, updateSubrogancia, deleteSubrogancia } from '../../../../services/subroganciaService';

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
            let response;
            if (editingSubroganciaId) {
                response = await updateSubrogancia(editingSubroganciaId, subroganciaData);
            } else {
                response = await saveSubrogancia(subroganciaData);
            }
            if (response && response.status >= 200 && response.status < 300) {
                void Swal.fire({ icon: 'success', title: editingSubroganciaId ? 'Cambios Guardados' : 'Subrogancia Guardada', text: 'Registrada correctamente.' });
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
        isSaving, editingSubroganciaId, editingSubroganciaData,
        handleEditClick, handleDelete, cancelEdit, handleSubmit, getSubmitButtonText,
    };
};
