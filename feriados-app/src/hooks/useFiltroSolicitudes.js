import { useState } from 'react';
import { useAlertaSweetAlert } from './useAlertaSweetAlert';

export const useFiltroSolicitudes = (onFiltrar) => {
    const [anio, setAnio] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [nombreSolicitante, setNombreSolicitante] = useState('');
    const [rutSolicitante, setRutSolicitante] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const { mostrarAlertaError } = useAlertaSweetAlert();

    const handleAnioChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 4) {
            setAnio(value);
        }
    };

    const handleFiltrar = () => {
        if (anio && anio.length !== 4) {
            mostrarAlertaError('El año ingresado no es válido. Por favor, ingrese un año con 4 dígitos.');
            return;
        }

        const filtros = {
            anio,
            fechaInicio,
            fechaFin,
            nombreSolicitante,
            rutSolicitante,
        };
        onFiltrar(filtros);
    };

    const handleLimpiarFiltros = () => {
        setAnio('');
        setFechaInicio('');
        setFechaFin('');
        setNombreSolicitante('');
        setRutSolicitante('');
        onFiltrar({});
    };

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    return {
        anio,
        fechaInicio,
        fechaFin,
        nombreSolicitante,
        rutSolicitante,
        isOpen,
        handleAnioChange,
        handleFiltrar,
        handleLimpiarFiltros,
        toggleCollapse,
        setFechaInicio,
        setFechaFin,
        setNombreSolicitante,
        setRutSolicitante
    };
};