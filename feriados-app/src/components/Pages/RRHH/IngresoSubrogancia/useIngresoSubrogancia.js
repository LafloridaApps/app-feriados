import { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { useFuncionarioSearch } from '../../../../hooks/useFuncionarioSearch';
import { saveSubrogancia, subroganciaService, updateSubrogancia, deleteSubrogancia } from '../../../../services/subroganciaService';
import { DepartamentoContext } from '../../../../context/DepartamentoContext';

export const useIngresoSubrogancia = () => {
    // Tab State
    const [activeTab, setActiveTab] = useState('buscar'); // 'buscar' or 'crear'

    // Form Search State
    const [filtroRutJefe, setFiltroRutJefe] = useState('');
    const [filtroRutSubrogante, setFiltroRutSubrogante] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [filtroIdDepto, setFiltroIdDepto] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [showDeptoModal, setShowDeptoModal] = useState(false);

    const { departamentos } = useContext(DepartamentoContext);

    const handleLimpiarFiltros = () => {
        setFiltroRutJefe('');
        setFiltroRutSubrogante('');
        setFiltroDepartamento('');
        setFiltroIdDepto('');
        setSearchResults([]);
    };

    // Form Create State
    const jefe = useFuncionarioSearch();
    const subrogante = useFuncionarioSearch();
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingSubroganciaId, setEditingSubroganciaId] = useState(null);
    const [editingSubroganciaData, setEditingSubroganciaData] = useState(null);
    const [showBusquedaModal, setShowBusquedaModal] = useState(false);
    const [modalTarget, setModalTarget] = useState(null);

    // Handlers Search
    const handleSearch = async (e) => {
        e.preventDefault();

        const filledFilters = [filtroRutJefe, filtroRutSubrogante, filtroDepartamento].filter(Boolean);
        if (filledFilters.length === 0) {
            void Swal.fire({ icon: 'warning', title: 'Filtro requerido', text: 'Ingrese al menos un criterio de búsqueda.' });
            return;
        }
        if (filledFilters.length > 1) {
            void Swal.fire({ icon: 'warning', title: 'Un solo filtro', text: 'Ingrese solo un criterio a la vez: RUT Jefe, RUT Subrogante o Departamento.' });
            return;
        }

        const soloRut = (rutCompleto) => rutCompleto.split('-')[0].trim();

        setIsSearching(true);
        try {
            const params = {};
            if (filtroRutJefe) params.rutJefe = soloRut(filtroRutJefe);
            if (filtroRutSubrogante) params.subrogante = soloRut(filtroRutSubrogante);
            
            // Priorizar el ID del departamento seleccionado
            if (filtroIdDepto) {
                params.idDepto = filtroIdDepto;
            } else if (filtroDepartamento) {
                // Si escribió algo pero no seleccionó del autocompletado, 
                // intentar buscar coincidencia exacta por nombre antes de fallar
                const match = departamentos.find(d => d.nombreDepartamento.toLowerCase() === filtroDepartamento.toLowerCase());
                if (match) {
                    params.idDepto = match.idDepto;
                } else {
                    void Swal.fire({ icon: 'warning', title: 'Departamento no válido', text: 'Seleccione un departamento de la lista de sugerencias.' });
                    setIsSearching(false);
                    return;
                }
            }

            const resultados = await subroganciaService.buscarSubroganciasExistentes(params);
            const lista = Array.isArray(resultados) ? resultados : [];
            setSearchResults(lista);

            if (lista.length === 0) {
                void Swal.fire({ icon: 'info', title: 'Sin resultados', text: 'No se encontraron subrogancias con los filtros indicados.' });
            }
        } catch (error) {
            console.error(error);
            void Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo realizar la búsqueda. Verifique la conexión con el servidor.' });
        } finally {
            setIsSearching(false);
        }
    };

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

    const handleOpenBusquedaModal = (target) => {
        setModalTarget(target);
        setShowBusquedaModal(true);
    };

    const handleSearchByName = async (nombre) => {
        return await subroganciaService.buscarPorNombre(nombre, null, null, 0, null);
    };

    const handleFuncionarioSelected = async (funcionario) => {
        const fullRut = `${funcionario.rut}-${funcionario.vrut}`;

        if (modalTarget === 'filtroJefe') {
            setFiltroRutJefe(fullRut);
        } else if (modalTarget === 'filtroSub') {
            setFiltroRutSubrogante(fullRut);
        } else if (modalTarget === 'createJefe') {
            jefe.initData(fullRut, funcionario.rut, `${funcionario.nombre} ${funcionario.apellidoPaterno} ${funcionario.apellidoMaterno}`, funcionario.departamento);
        } else if (modalTarget === 'createSub') {
            subrogante.initData(fullRut, funcionario.rut, `${funcionario.nombre} ${funcionario.apellidoPaterno} ${funcionario.apellidoMaterno}`, funcionario.departamento);
        }
    };

    const handleDepartamentoSelected = (depto) => {
        setFiltroDepartamento(depto.nombreDepartamento);
        setFiltroIdDepto(depto.idDepto);
    };

    return {
        activeTab,
        setActiveTab,
        showBusquedaModal,
        setShowBusquedaModal,
        showDeptoModal,
        setShowDeptoModal,
        handleFuncionarioSelected,
        handleSearchByName,
        handleDepartamentoSelected,
        filtroRutJefe,
        setFiltroRutJefe,
        filtroRutSubrogante,
        setFiltroRutSubrogante,
        filtroDepartamento,
        setFiltroDepartamento,
        setFiltroIdDepto,
        mostrarSugerencias,
        setMostrarSugerencias,
        departamentos,
        isSearching,
        handleSearch,
        handleLimpiarFiltros,
        handleOpenBusquedaModal,
        searchResults,
        handleEditClick,
        editingSubroganciaId,
        editingSubroganciaData,
        jefe,
        subrogante,
        fechaInicio,
        setFechaInicio,
        fechaFin,
        setFechaFin,
        isSaving,
        handleSubmit,
        handleDelete,
        cancelEdit,
        getSubmitButtonText
    };
};
