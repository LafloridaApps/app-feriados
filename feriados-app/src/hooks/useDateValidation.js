// hooks/useDateValidation.js
import { useState, useCallback } from "react";

export const useDateValidation = (fechasFeriadas, detalleFer, detalleAdm, tipo) => {
    const [errorFecha, setErrorFecha] = useState("");
    const [errorFeriado, setErrorFeriado] = useState("");
    const [errorRangoFechas, setErrorRangoFechas] = useState("");

    const hayConflictoDeFechas = useCallback((inicioForm, terminoForm) => {
        const data = tipo === "FERIADO" ? detalleFer : detalleAdm;
        return data?.some(item => {
            const inicioExistente = new Date(item.fechaInicio);
            const terminoExistente = new Date(item.fechaTermino);
            return inicioForm <= terminoExistente && terminoForm >= inicioExistente;
        }) ?? false;
    }, [tipo, detalleAdm, detalleFer]);

    const validarFechas = useCallback((inicio, fin) => {
        const inicioDate = new Date(inicio);
        const finDate = new Date(fin);
        let currentErrorFecha = "";
        let currentErrorFeriado = "";
        let currentErrorRangoFechas = "";

        if (inicioDate > finDate) {
            currentErrorFecha = "La fecha de inicio no puede ser mayor a la fecha de fin";
        }

        if (fechasFeriadas.includes(inicio) || fechasFeriadas.includes(fin)) {
            currentErrorFeriado = "La fecha de inicio o fin no puede ser feriado";
        }

        if (hayConflictoDeFechas(inicioDate, finDate)) {
            currentErrorRangoFechas = "El rango de fechas solicitadas ya fue ocupado";
        }

        setErrorFecha(currentErrorFecha);
        setErrorFeriado(currentErrorFeriado);
        setErrorRangoFechas(currentErrorRangoFechas);

        return !currentErrorFecha && !currentErrorFeriado && !currentErrorRangoFechas; // Devuelve true si no hay errores
    }, [fechasFeriadas, hayConflictoDeFechas]);

    return {
        errorFecha,
        errorFeriado,
        errorRangoFechas,
        validarFechas,
        resetErrors: () => {
            setErrorFecha("");
            setErrorFeriado("");
            setErrorRangoFechas("");
        }
    };
};