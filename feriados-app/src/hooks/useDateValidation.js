// hooks/useDateValidation.js
import { useState, useCallback } from "react";

export const useDateValidation = (fechasFeriadas, detalleFer, detalleAdm) => {
    const [errorFecha, setErrorFecha] = useState("");
    const [errorFeriado, setErrorFeriado] = useState("");
    const [errorRangoFechas, setErrorRangoFechas] = useState("");

    const validarFechas = useCallback((inicio, fin, tipo, jornadaInicio, jornadaFin) => {
        // Basic validation for date order
        const inicioDate = new Date(inicio);
        const finDate = new Date(fin);
        let currentErrorFecha = "";
        let currentErrorFeriado = "";
        let currentErrorRangoFechas = ""; // This will no longer be set here

        if (inicioDate > finDate) {
            currentErrorFecha = "La fecha de inicio no puede ser mayor a la fecha de fin";
        }

        // Check if start or end date is a holiday
        if (fechasFeriadas.includes(inicio) || fechasFeriadas.includes(fin)) {
            currentErrorFeriado = "La fecha de inicio o fin no puede ser feriado";
        }

        // Conflict check is removed from here and will be handled on submit
        // if (hayConflictoDeFechas(inicio, fin, tipo, jornadaInicio, jornadaFin)) {
        //     currentErrorRangoFechas = "El rango de fechas solicitadas ya fue ocupado";
        // }

        setErrorFecha(currentErrorFecha);
        setErrorFeriado(currentErrorFeriado);
        setErrorRangoFechas(currentErrorRangoFechas);

        return !currentErrorFecha && !currentErrorFeriado && !currentErrorRangoFechas;
    }, [fechasFeriadas]); // hayConflictoDeFechas removed from dependencies

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