import { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { subroganciaService } from '../../../../services/subroganciaService';
import { DepartamentoContext } from '../../../../context/DepartamentoContext';

export const useBusquedaSubrogancias = () => {
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

    const handleDepartamentoSelected = (depto) => {
        setFiltroDepartamento(depto.nombreDepartamento);
        setFiltroIdDepto(depto.idDepto);
    };

    return {
        filtroRutJefe, setFiltroRutJefe,
        filtroRutSubrogante, setFiltroRutSubrogante,
        filtroDepartamento, setFiltroDepartamento, setFiltroIdDepto,
        mostrarSugerencias, setMostrarSugerencias,
        showDeptoModal, setShowDeptoModal, departamentos,
        isSearching, searchResults, setSearchResults,
        handleSearch, handleLimpiarFiltros, handleDepartamentoSelected,
    };
};
