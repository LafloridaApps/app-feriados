import { useState } from 'react';
import { subroganciaService } from '../../../../services/subroganciaService';
import { useBusquedaSubrogancias } from './useBusquedaSubrogancias';
import { useFormularioSubrogancia } from './useFormularioSubrogancia';

export const useIngresoSubrogancia = () => {
    const [activeTab, setActiveTab] = useState('buscar');
    const [showBusquedaModal, setShowBusquedaModal] = useState(false);
    const [modalTarget, setModalTarget] = useState(null);

    const { setSearchResults, ...busqueda } = useBusquedaSubrogancias();
    const formulario = useFormularioSubrogancia({ setActiveTab, setSearchResults });
    const { jefe, subrogante } = formulario;
    const { setFiltroRutJefe, setFiltroRutSubrogante } = busqueda;

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

    return {
        activeTab, setActiveTab,
        showBusquedaModal, setShowBusquedaModal,
        handleFuncionarioSelected, handleSearchByName, handleOpenBusquedaModal,
        ...busqueda,
        ...formulario,
    };
};
