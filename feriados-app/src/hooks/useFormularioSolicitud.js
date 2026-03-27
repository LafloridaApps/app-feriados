import { useState, useEffect, useContext, useCallback } from "react";
import Swal from 'sweetalert2';
import { calculoDiasAusar, fechaActual, calcularPrimerDiaDelMes, calcularPrimerDiaMesAnterior } from "../services/utils";
import { getSolicitudByFechaInicioAndTipo, saveSolicitud } from '../services/solicitudService';
import { UsuarioContext } from "../context/UsuarioContext";
import { FeriadosContext } from "../context/FeriadosContext";
import { useDateValidation } from "./useDateValidation";

const initialState = {
    rut: 0,
    fechaSolicitud: "",
    fechaInicio: "",
    fechaFin: "",
    depto: "",
    tipoSolicitud: "",
};

export const useFormularioSolicitud = ({ resumenAdministrativo, resumenFeriados, detalleAdministrativo, detalleFeriados }) => {
    const [tipo, setTipo] = useState("");
    const [fechaInicio, setFechaInicio] = useState(fechaActual());
    const [fechaFin, setFechaFin] = useState(fechaActual());
    const [diasUsarFeriado, setDiasUsarFeriado] = useState(null);
    const [diasUsarAdministrativo, setDiasUsarAdministrativo] = useState(null);
    const [saldoFeriado, setSaldoFeriado] = useState(0);
    const [saldoAdministrativo, setSaldoAdministrativo] = useState(0);
    const [enviando, setEnviando] = useState(false);
    const [subrogancia, setSubrogancia] = useState(null);
    const [mostrarModalSubrogante, setMostrarModalSubrogante] = useState(false);
    const [solicitud, setSolicitud] = useState(initialState);
    const [jornadaInicio, setJornadaInicio] = useState("AM");
    const [jornadaFin, setJornadaFin] = useState("PM");
    const [errorSaldo, setErrorSaldo] = useState("");
    const [minDateInicio, setMinDateInicio] = useState('');
    const [maxDateFin, setMaxDateFin] = useState('');
    const [fechaEditada, setFechaEditada] = useState('inicio'); // Control which date is being edited
    const [errorBloqueDiezDias, setErrorBloqueDiezDias] = useState("");


    const funcionario = useContext(UsuarioContext);
    const feriados = useContext(FeriadosContext);
    const fechasFeriadas = feriados.map(f => f.fecha);
    const rut = funcionario?.rut;
    const depto = funcionario?.codDepto;
    const codDeptoJefe = funcionario?.codDeptoJefe;


    const { errorFecha, errorFeriado, errorRangoFechas, validarFechas, resetErrors } = useDateValidation(fechasFeriadas, detalleFeriados, detalleAdministrativo);

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
            const fechaStr = d.toISOString().split('T')[0];
            return dia !== 0 && dia !== 6 && !fechasFeriadas.includes(fechaStr);
        }

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
            const diff = Math.round(Math.abs((f.getTime() - i.getTime()) / (1000 * 60 * 60 * 24))) + 1;
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

    const diasUsar = tipo === "FERIADO" ? diasUsarFeriado : diasUsarAdministrativo;
    const saldo = tipo === "FERIADO" ? saldoFeriado : saldoAdministrativo;

    useEffect(() => {
        const gestionarFechas = () => {
            if (!tipo) return { currentFechaFin: fechaFin, fechaFinMaxima: null };

            const diasDisponibles = tipo === "FERIADO" ? resumenFeriados?.dias_pendientes : resumenAdministrativo?.saldo;
            if (diasDisponibles == null) return { currentFechaFin: fechaFin, fechaFinMaxima: null };

            const fechaFinMaxima = calcularFechaFinPropuesta(fechaInicio, diasDisponibles);
            setMaxDateFin(fechaFinMaxima);

            let currentFechaFin = fechaFin;
            if (fechaEditada === 'inicio' || fechaEditada === 'tipo') {
                if (currentFechaFin !== fechaFinMaxima) {
                    setFechaFin(fechaFinMaxima);
                    currentFechaFin = fechaFinMaxima;
                }
            } else if (new Date(currentFechaFin) > new Date(fechaFinMaxima)) {
                setFechaFin(fechaFinMaxima);
                currentFechaFin = fechaFinMaxima;
            }

            return { currentFechaFin, fechaFinMaxima };
        };

        const validarFeriado = (diasSolicitados, currentFechaFin) => {
            setDiasUsarFeriado(diasSolicitados);
            const nuevoSaldo = (resumenFeriados?.dias_pendientes || 0) - diasSolicitados;
            setSaldoFeriado(nuevoSaldo);
            setErrorSaldo(nuevoSaldo < 0 ? "No tienes saldo suficiente." : "");

            const fInicio = new Date(fechaInicio);
            const fFin = new Date(currentFechaFin);
            const diasCorridos = Math.round(Math.abs((fFin.getTime() - fInicio.getTime()) / (1000 * 60 * 60 * 24))) + 1;

            const cumpleReglaDiezDias = yaTieneBloqueDiezDias() || diasCorridos >= 10 || (nuevoSaldo >= 10) || nuevoSaldo < 0;
            if (cumpleReglaDiezDias) {
                setErrorBloqueDiezDias("");
            } else {
                setErrorBloqueDiezDias(`De acuerdo a la Ley N°18.883, debes tomar al menos un bloque de 10 días corridos. Esta solicitud de ${diasCorridos} días corridos dejaría tu saldo en ${nuevoSaldo} días, impidiendo cumplir con esta normativa.`);
            }
        };

        const validarAdministrativo = (diasSolicitados) => {
            setDiasUsarAdministrativo(diasSolicitados);
            const nuevoSaldo = (resumenAdministrativo?.saldo || 0) - diasSolicitados;
            setSaldoAdministrativo(nuevoSaldo);
            setErrorSaldo(nuevoSaldo < 0 ? "No tienes saldo suficiente." : "");
            setErrorBloqueDiezDias("");
        };

        const actualizar = () => {
            if (!tipo) {
                setDiasUsarFeriado(null);
                setDiasUsarAdministrativo(null);
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

            validarFechas(fechaInicio, currentFechaFin, tipo, jornadaInicio, jornadaFin);
        };

        actualizar();
    }, [fechaInicio, fechaFin, tipo, resumenFeriados, resumenAdministrativo, calcularFechaFinPropuesta, validarFechas, fechasFeriadas, jornadaInicio, jornadaFin, fechaEditada, yaTieneBloqueDiezDias]);

    const handlerFechaInicio = useCallback((e) => {
        setFechaInicio(e.target.value);
        setFechaEditada('inicio');
    }, []);

    const handlerFechaFin = useCallback((e) => {
        setFechaFin(e.target.value);
        setFechaEditada('fin');
    }, []);

    const handlerTipo = useCallback((e) => {
        const newTipo = e.target.value;
        setTipo(newTipo);
        setFechaEditada('tipo');
        if (newTipo === '') {
            setFechaInicio('');
            setFechaFin('');
        }
    }, []);

    const mostrarAlertaError = useCallback((mensaje) => {
        if (mensaje) Swal.fire({ icon: 'error', title: 'Oops...', text: mensaje });
    }, []);

    useEffect(() => {
        mostrarAlertaError(errorSaldo);
        mostrarAlertaError(errorFecha);
        mostrarAlertaError(errorFeriado);
        mostrarAlertaError(errorRangoFechas);
    }, [errorSaldo, errorFecha, errorFeriado, errorRangoFechas, mostrarAlertaError]);

    const handleSaveSolicitud = useCallback(async () => {
        const nuevaSolicitud = {
            ...solicitud,
            rut,
            fechaSolicitud: fechaActual(),
            fechaInicio,
            fechaFin,
            depto,
            tipoSolicitud: tipo,
            ...(tipo === "ADMINISTRATIVO" && {
                jornadaInicio,
                jornadaTermino: jornadaFin,
            }),
            ...(subrogancia && {
                subrogancia
            }),
        };

        const diasSolicitados = tipo === "FERIADO" ? diasUsarFeriado : diasUsarAdministrativo;

        const confirm = await Swal.fire({
            icon: 'question',
            title: 'Confirmar Solicitud',
            html: `
                    <p>¿Está seguro de enviar la solicitud con los siguientes detalles?</p>
                    <strong>Tipo:</strong> ${tipo}<br>
                    <strong>Fecha de Inicio:</strong> ${fechaInicio}<br>
                    <strong>Fecha de Término:</strong> ${fechaFin}<br>
                    <strong>Días solicitados:</strong> ${diasSolicitados}
                `,
            showCancelButton: true,
            confirmButtonText: 'Sí, enviar solicitud',
            cancelButtonText: 'No, cancelar',
        });

        if (!confirm.isConfirmed) return;

        try {
            setEnviando(true);


            const res = await saveSolicitud(nuevaSolicitud);
            await Swal.fire({
                icon: 'success',
                title: 'Solicitud enviada',
                html: `Tu solicitud fue creada con el ID <strong>${res.id}</strong> y derivada al depto <strong>${res.nombreDepartamento}</strong>.`,
            });
            setSolicitud(initialState);
            setFechaInicio(fechaActual());
            setFechaFin(fechaActual());
            setDiasUsarFeriado(null);
            setDiasUsarAdministrativo(null);
            setSubrogancia(null);
            resetErrors();
            setErrorSaldo("");
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Hubo un problema al enviar la solicitud.' });
        } finally {
            setEnviando(false);
        }
    }, [solicitud, rut, fechaInicio, fechaFin, depto, tipo, jornadaInicio, jornadaFin, subrogancia, diasUsarFeriado, diasUsarAdministrativo, resetErrors]);

    const verificarConflictoFechas = async () => {
        const existe = await getSolicitudByFechaInicioAndTipo(rut, fechaInicio, tipo);
        if (!existe?.estado || existe.estado === 'POSTERGADA') return false;

        let conflict = true;
        if (tipo === 'ADMINISTRATIVO') {
            const esSolicitudMismoDia = fechaInicio === fechaFin;
            const esExistenteMismoDia = existe.fechaInicio.substring(0, 10) === existe.fechaTermino.substring(0, 10);

            if (esSolicitudMismoDia && esExistenteMismoDia) {
                const { jornadaInicio: jInicioEx, jornadaTermino: jFinEx } = existe;

                const esNuevaMediaAM = jornadaInicio === 'AM' && jornadaFin === 'AM';
                const esNuevaMediaPM = jornadaInicio === 'PM' && jornadaFin === 'PM';

                const esExistenteMediaAM = jInicioEx === 'AM' && jFinEx === 'AM';
                const esExistenteMediaPM = jInicioEx === 'PM' && jFinEx === 'PM';

                if ((esNuevaMediaAM && esExistenteMediaPM) || (esNuevaMediaPM && esExistenteMediaAM)) {
                    conflict = false;
                }
            }
        }
        return conflict;
    };

    const procesarSinSubrogante = async () => {
        const confirm = await Swal.fire({
            title: '¿Continuar sin subrogante?',
            text: "Estás por enviar una solicitud sin designar un subrogante. ¿Deseas continuar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'No, designar subrogante'
        });

        if (confirm.isConfirmed) {
            await handleSaveSolicitud();
        } else {
            setMostrarModalSubrogante(true);
        }
    };

    const submitForm = async (e, esJefe, esDirector) => {
        e.preventDefault();

        const isValid = validarFechas(fechaInicio, fechaFin, tipo, jornadaInicio, jornadaFin);
        if (!isValid || errorSaldo) {
            mostrarAlertaError(errorSaldo || 'Existen errores en las fechas seleccionadas.');
            return;
        }

        // Validacion de subrogancia para directores
        if (esDirector && !subrogancia) {
            await Swal.fire({
                icon: 'info',
                title: 'Subrogante Requerido',
                text: 'Como director, es obligatorio que designe un subrogante.'
            });
            setMostrarModalSubrogante(true);
            return;
        }

        try {
            if (await verificarConflictoFechas()) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Ya existe una solicitud',
                    text: 'Tienes una solicitud en este mismo rango de fechas.',
                });
                return;
            }

            if (esJefe && !esDirector && !subrogancia) {
                await procesarSinSubrogante();
                return;
            }

            await handleSaveSolicitud();

        } catch (error) {
            console.error('Error inesperado al procesar la solicitud:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: error.response?.data?.message || 'Hubo un problema al procesar la solicitud.',
            });
        }
    };

    const handleSubroganteSelected = (subrogancia) => {
        setSubrogancia(subrogancia);
        setMostrarModalSubrogante(false);
    };

    const hanglerEliminarSubrogancia = () => {
        setSubrogancia(null);
        setMostrarModalSubrogante(false);
    };

    const closeSubroganteModal = () => {
        setMostrarModalSubrogante(false);
    };

    const hasErrors = !!errorSaldo || !!errorFecha || !!errorFeriado || !!errorRangoFechas || !!errorBloqueDiezDias;

    return {
        tipo, handlerTipo, // Return new handler
        fechaInicio, handlerFechaInicio,
        fechaFin, handlerFechaFin,
        jornadaInicio, setJornadaInicio,
        jornadaFin, setJornadaFin,
        diasUsar,
        saldo,
        error: hasErrors,
        errorBloqueDiezDias,
        enviando,
        submitForm,
        mostrarModalSubrogante,
        handleSubroganteSelected,
        closeSubroganteModal,
        rut,
        depto,
        subrogancia,
        codDeptoJefe,
        hanglerEliminarSubrogancia,
        minDateInicio,
        maxDateFin
    };
};

