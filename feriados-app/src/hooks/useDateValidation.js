// hooks/useDateValidation.js
import { useState, useCallback } from "react";

export const useDateValidation = (fechasFeriadas, detalleFer, detalleAdm) => {
    const [errorFecha, setErrorFecha] = useState("");
    const [errorFeriado, setErrorFeriado] = useState("");
    const [errorRangoFechas, setErrorRangoFechas] = useState("");


    const hayConflictoDeFechas = useCallback((inicioFormStr, terminoFormStr, tipo, jornadaInicioForm, jornadaFinForm) => {
        const data = tipo === "FERIADO" ? detalleFer : detalleAdm;

        // Helper to create a date at midnight UTC to avoid timezone issues
        const toUTCDate = (dateString) => {
            const [year, month, day] = dateString.split('-').map(Number);
            return new Date(Date.UTC(year, month - 1, day));
        };

        const inicioForm = toUTCDate(inicioFormStr);
        const terminoForm = toUTCDate(terminoFormStr);

        return data?.some(item => {
            if (item.estado === 'POSTERGADA') {
                return false;
            }

            // Normalize existing request dates by taking only the date part (YYYY-MM-DD)
            const inicioExistente = toUTCDate(item.fechaInicio.substring(0, 10));
            const terminoExistente = toUTCDate(item.fechaTermino.substring(0, 10));

            // Standard overlap check
            const hayTraslapeFechas = inicioForm <= terminoExistente && terminoForm >= inicioExistente;
            if (!hayTraslapeFechas) {
                return false;
            }

            // Special handling for half-day administrative leave
            if (tipo === 'ADMINISTRATIVO') {
                const esSolicitudMismoDia = inicioForm.getTime() === terminoForm.getTime();
                const esExistenteMismoDia = inicioExistente.getTime() === terminoExistente.getTime();

                if (esSolicitudMismoDia && esExistenteMismoDia) {
                    const { jornadaInicio: jInicioEx, jornadaTermino: jFinEx } = item;

                    const esNuevaMediaAM = jornadaInicioForm === 'AM' && jornadaFinForm === 'AM';
                    const esNuevaMediaPM = jornadaInicioForm === 'PM' && jornadaFinForm === 'PM';

                    const esExistenteMediaAM = jInicioEx === 'AM' && jFinEx === 'AM';
                    const esExistenteMediaPM = jInicioEx === 'PM' && jFinEx === 'PM';

                    // If one is AM and the other is PM, it's not a conflict
                    if ((esNuevaMediaAM && esExistenteMediaPM) || (esNuevaMediaPM && esExistenteMediaAM)) {
                        return false;
                    }
                }
            }

            // If we get here, it's a conflict
            return true;
        }) ?? false;
    }, [detalleAdm, detalleFer]);



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