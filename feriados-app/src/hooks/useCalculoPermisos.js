import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { calculoDiasAusar, calcularPrimerDiaDelMes, calcularPrimerDiaMesAnterior } from '../services/utils';
import { useDateValidation } from './useDateValidation';

const MS_POR_DIA = 86400000;

const calcularDiasParaCalculo = (tipo, diasDisponibles, permiteMedioDia) => {
    if (tipo !== 'ADMINISTRATIVO' || diasDisponibles % 1 === 0) return diasDisponibles;
    return permiteMedioDia ? Math.ceil(diasDisponibles) : Math.floor(diasDisponibles);
};

export const useCalculoPermisos = ({
    tipo, fechaInicio, fechaFin, setFechaFin, permiteMedioDia = true,
    jornadaInicio, jornadaFin, setJornadaFin, fechaEditada,
    resumenAdministrativo, resumenFeriados, detalleFeriados, fechasFeriadas,
}) => {
    const [diasUsarFeriado, setDiasUsarFeriado] = useState(null);
    const [diasUsarAdministrativo, setDiasUsarAdministrativo] = useState(null);
    const [saldoFeriado, setSaldoFeriado] = useState(0);
    const [saldoAdministrativo, setSaldoAdministrativo] = useState(0);
    const [errorSaldo, setErrorSaldo] = useState("");
    const [minDateInicio, setMinDateInicio] = useState('');
    const [maxDateFin, setMaxDateFin] = useState('');
    const [errorBloqueDiezDias, setErrorBloqueDiezDias] = useState("");

    const { errorFecha, errorFeriado, errorRangoFechas, validarFechas, resetErrors } = useDateValidation(fechasFeriadas);

    const parseDateAsLocal = (dateString) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const calcularFechaFinPropuesta = useCallback((inicio, cantidadDias) => {
        if (!inicio || cantidadDias <= 0) return inicio;
        let fecha = parseDateAsLocal(inicio);
        let diasRestantes = cantidadDias - 1;
        if (diasRestantes < 0) diasRestantes = 0;

        const esDiaHabil = (d) => {
            const dia = d.getDay();
            const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            return dia !== 0 && dia !== 6 && !fechasFeriadas.includes(fechaStr);
        };

        if (!esDiaHabil(fecha)) {
            diasRestantes++;
        }

        while (diasRestantes > 0) {
            fecha.setDate(fecha.getDate() + 1);
            if (esDiaHabil(fecha)) {
                diasRestantes--;
            }
        }
        return fecha.toISOString().split("T")[0];
    }, [fechasFeriadas]);

    const yaTieneBloqueDiezDias = useCallback(() => {
        if (!detalleFeriados || !Array.isArray(detalleFeriados)) return false;
        return detalleFeriados.some(sol => {
            const i = new Date(sol.fechaInicio);
            const f = new Date(sol.fechaTermino || sol.fechaFin);
            if (Number.isNaN(i.getTime()) || Number.isNaN(f.getTime())) return false;
            const diff = Math.round(Math.abs((f.getTime() - i.getTime()) / MS_POR_DIA)) + 1;
            return diff >= 10;
        });
    }, [detalleFeriados]);

    useEffect(() => {
        const today = new Date();
        const dayOfMonth = today.getDate();
        let minDate;
        if (dayOfMonth > 7) {
            minDate = calcularPrimerDiaDelMes();
        } else {
            minDate = calcularPrimerDiaMesAnterior();
        }
        setMinDateInicio(minDate);
    }, []);

    // Sincroniza jornadaFin según el saldo de ADMINISTRATIVO (media jornada = .5)
    const sincronizarJornada = useCallback((saldoAdm) => {
        if (saldoAdm === null || saldoAdm === undefined) return;
        setJornadaFin(!permiteMedioDia || saldoAdm % 1 === 0 ? 'PM' : 'AM');
    }, [setJornadaFin, permiteMedioDia]);

    // Auto-ajustar jornadaFin cuando ADMINISTRATIVO tiene saldo con media jornada (.5)
    useEffect(() => {
        if (tipo === 'ADMINISTRATIVO') {
            sincronizarJornada(resumenAdministrativo?.saldo);
        }
    }, [tipo, resumenAdministrativo, sincronizarJornada]);

    let diasUsar = null;
    let saldo = null;

    if (tipo === "FERIADO") {
        diasUsar = diasUsarFeriado;
        saldo = saldoFeriado;
    } else if (tipo === "ADMINISTRATIVO") {
        diasUsar = diasUsarAdministrativo;
        saldo = saldoAdministrativo;
    }

    const gestionarFechas = useCallback(() => {
        if (!tipo) return { currentFechaFin: fechaFin, fechaFinMaxima: null };

        const diasDisponibles = tipo === "FERIADO" ? resumenFeriados?.dias_pendientes : resumenAdministrativo?.saldo;
        if (diasDisponibles === null || diasDisponibles === undefined) return { currentFechaFin: fechaFin, fechaFinMaxima: null };

        // Para ADMINISTRATIVO con media jornada (ej: 1.5) se redondea según permitaMedioDia.
        const fechaFinMaxima = calcularFechaFinPropuesta(fechaInicio, calcularDiasParaCalculo(tipo, diasDisponibles, permiteMedioDia));
        setMaxDateFin(fechaFinMaxima);

        const ajustarFechaFin = (actual) => {
            if (fechaEditada === 'inicio' || fechaEditada === 'tipo') {
                return fechaFinMaxima && actual !== fechaFinMaxima ? fechaFinMaxima : actual;
            }
            // Garantizar que la fecha fin no sea nula ni quede antes de la de inicio,
            // y que no supere el máximo permitido.
            let ajustada = actual;
            if (!ajustada || new Date(ajustada) < new Date(fechaInicio)) ajustada = fechaInicio;
            if (fechaFinMaxima && new Date(ajustada) > new Date(fechaFinMaxima)) ajustada = fechaFinMaxima;
            return ajustada;
        };

        const currentFechaFin = ajustarFechaFin(fechaFin);
        if (currentFechaFin !== fechaFin) setFechaFin(currentFechaFin);

        return { currentFechaFin, fechaFinMaxima };
    }, [tipo, fechaFin, fechaInicio, fechaEditada, resumenFeriados, resumenAdministrativo, calcularFechaFinPropuesta, setFechaFin, permiteMedioDia]);

    const validarFeriado = useCallback((diasSolicitados, currentFechaFin) => {
        setDiasUsarFeriado(diasSolicitados);
        const saldoPrevio = resumenFeriados?.dias_pendientes || 0;
        const nuevoSaldo = saldoPrevio - diasSolicitados;
        setSaldoFeriado(nuevoSaldo);
        setErrorSaldo(nuevoSaldo < 0 ? "No tienes saldo suficiente." : "");

        const fInicio = new Date(fechaInicio);
        const fFin = new Date(currentFechaFin);
        const diasCorridos = Math.round(Math.abs((fFin.getTime() - fInicio.getTime()) / MS_POR_DIA)) + 1;

        // Excepción para casos antiguos: si el saldo previo ya es menor a 10 días,
        // se le permite usar sus días restantes sin bloquearlo.
        const excepcionCasosAntiguos = saldoPrevio < 10;

        const cumpleReglaDiezDias = excepcionCasosAntiguos || yaTieneBloqueDiezDias() || diasCorridos >= 10 || (nuevoSaldo >= 10) || nuevoSaldo < 0;
        if (cumpleReglaDiezDias) {
            setErrorBloqueDiezDias("");
        } else {
            setErrorBloqueDiezDias(`De acuerdo a la Ley N°18.883, debes tomar al menos un bloque de 10 días corridos. Esta solicitud de ${diasCorridos} días corridos dejaría tu saldo en ${nuevoSaldo} días, impidiendo cumplir con esta normativa.`);
        }
    }, [resumenFeriados, fechaInicio, yaTieneBloqueDiezDias]);

    const validarAdministrativo = useCallback((diasSolicitados) => {
        setDiasUsarAdministrativo(diasSolicitados);
        const nuevoSaldo = (resumenAdministrativo?.saldo || 0) - diasSolicitados;
        setSaldoAdministrativo(nuevoSaldo);
        setErrorSaldo(nuevoSaldo < 0 ? "No tienes saldo suficiente." : "");
        setErrorBloqueDiezDias("");
    }, [resumenAdministrativo]);

    useEffect(() => {
        const actualizar = () => {
            if (!tipo) {
                setDiasUsarFeriado(null);
                setDiasUsarAdministrativo(null);
                setSaldoFeriado(0);
                setSaldoAdministrativo(0);
                setErrorSaldo("");
                setErrorBloqueDiezDias("");
                return;
            }

            const { currentFechaFin } = gestionarFechas();
            const diasSolicitados = calculoDiasAusar(fechaInicio, currentFechaFin, tipo, fechasFeriadas, jornadaInicio, jornadaFin);

            if (tipo === "FERIADO") {
                validarFeriado(diasSolicitados, currentFechaFin);
            } else {
                validarAdministrativo(diasSolicitados);
            }

            validarFechas(fechaInicio, currentFechaFin);
        };

        actualizar();
    }, [fechaInicio, fechaFin, tipo, resumenFeriados, resumenAdministrativo, calcularFechaFinPropuesta, validarFechas, fechasFeriadas, jornadaInicio, jornadaFin, fechaEditada, yaTieneBloqueDiezDias, gestionarFechas, validarFeriado, validarAdministrativo]);

    const mostrarAlertaError = useCallback((mensaje) => {
        if (mensaje) void Swal.fire({ icon: 'error', title: 'Oops...', text: mensaje });
    }, []);

    useEffect(() => {
        mostrarAlertaError(errorSaldo);
        mostrarAlertaError(errorFecha);
        mostrarAlertaError(errorFeriado);
        mostrarAlertaError(errorRangoFechas);
    }, [errorSaldo, errorFecha, errorFeriado, errorRangoFechas, mostrarAlertaError]);

    const resetCalculo = useCallback(() => {
        setDiasUsarFeriado(null);
        setDiasUsarAdministrativo(null);
        resetErrors();
        setErrorSaldo('');
    }, [resetErrors]);

    const hasErrors = !resumenAdministrativo || !resumenFeriados || !!errorSaldo || !!errorFecha || !!errorFeriado || !!errorRangoFechas || !!errorBloqueDiezDias;

    return {
        diasUsar, saldo, diasUsarFeriado, diasUsarAdministrativo,
        error: hasErrors, errorSaldo, errorBloqueDiezDias,
        minDateInicio, maxDateFin, sincronizarJornada,
        validarFechas, mostrarAlertaError, resetCalculo,
    };
};
