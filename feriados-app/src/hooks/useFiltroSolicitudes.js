import { useState } from 'react';

export const useFiltroSolicitudes = (onFiltrar) => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [nombreSolicitante, setNombreSolicitante] = useState('');
    const [rutSolicitante, setRutSolicitante] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleRutChange = (e) => {
        const raw = e.target.value;
        const limpio = raw.replace(/[^\dkK-]/gi, '').toUpperCase();
        if (limpio.length > 10) return;
        const digitos = limpio.replace(/-/g, '');
        if (digitos.length > 9) return;
        const tieneGuion = limpio.includes('-');
        if (!tieneGuion && digitos.length === 9) {
            const cuerpo = digitos.slice(0, -1);
            const dv = digitos.slice(-1);
            setRutSolicitante(`${cuerpo}-${dv}`);
        } else {
            setRutSolicitante(limpio);
        }
    };

    const handleFiltrar = () => {
        const filtros = {
            fechaInicio,
            fechaFin,
            nombreSolicitante,
            rutSolicitante,
        };
        onFiltrar(filtros);
    };

    const handleLimpiarFiltros = () => {
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
        fechaInicio,
        fechaFin,
        nombreSolicitante,
        rutSolicitante,
        isOpen,
        handleRutChange,
        handleFiltrar,
        handleLimpiarFiltros,
        toggleCollapse,
        setFechaInicio,
        setFechaFin,
        setNombreSolicitante,
        setRutSolicitante
    };
};