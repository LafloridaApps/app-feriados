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

export const useFormularioSolicitud = ({ resumenAdm, resumenFer, detalleAdm, detalleFer }) => {
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

    const funcionario = useContext(UsuarioContext);
    const feriados = useContext(FeriadosContext);
    const fechasFeriadas = feriados.map(f => f.fecha);
    const rut = funcionario?.rut;
    const depto = funcionario?.codDepto;
    const codDeptoJefe = funcionario?.codDeptoJefe;


    const { errorFecha, errorFeriado, errorRangoFechas, validarFechas, resetErrors } = useDateValidation(fechasFeriadas, detalleFer, detalleAdm, tipo, fechaInicio);

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
        const actualizar = () => {
            if (!tipo) { // Only run if a type is selected
                setDiasUsarFeriado(null);
                setDiasUsarAdministrativo(null);
                setErrorSaldo("");
                return;
            }

            const diasDisponibles = tipo === "FERIADO" ? resumenFer?.dias_pendientes : resumenAdm?.saldo;
            if (diasDisponibles == null) return;

            let currentFechaFin = fechaFin; // Use a local variable for current fechaFin

            const fechaFinMaxima = calcularFechaFinPropuesta(fechaInicio, diasDisponibles);
            setMaxDateFin(fechaFinMaxima);

            // If it's an initial load or type/fechaInicio change, set fechaFin to max
            if (fechaEditada === 'inicio' || fechaEditada === 'tipo') {
                if (currentFechaFin !== fechaFinMaxima) { // Only set if different
                    setFechaFin(fechaFinMaxima);
                    currentFechaFin = fechaFinMaxima; // Update local variable for immediate calculation
                }
                if (fechaEditada === 'tipo') setFechaEditada('inicio'); // Reset after type change
            } else if (new Date(currentFechaFin) > new Date(fechaFinMaxima)) {
                // If user selected beyond max, cap it
                setFechaFin(fechaFinMaxima);
                currentFechaFin = fechaFinMaxima; // Update local variable for immediate calculation
            }

            // Calculate diasSolicitados using the potentially updated currentFechaFin
            const diasSolicitados = calculoDiasAusar(fechaInicio, currentFechaFin, tipo, fechasFeriadas, jornadaInicio, jornadaFin);

            if (tipo === "FERIADO") {
                setDiasUsarFeriado(diasSolicitados);
                const nuevoSaldo = resumenFer.dias_pendientes - diasSolicitados;
                setSaldoFeriado(nuevoSaldo);
                setErrorSaldo(nuevoSaldo < 0 ? "No tienes saldo suficiente." : "");
            } else {
                setDiasUsarAdministrativo(diasSolicitados);
                const nuevoSaldo = resumenAdm.saldo - diasSolicitados;
                setSaldoAdministrativo(nuevoSaldo);
                setErrorSaldo(nuevoSaldo < 0 ? "No tienes saldo suficiente." : "");
            }
            validarFechas(fechaInicio, currentFechaFin); // Use currentFechaFin for validation
        };
        actualizar();
    }, [fechaInicio, fechaFin, tipo, resumenFer, resumenAdm, calcularFechaFinPropuesta, validarFechas, fechasFeriadas, jornadaInicio, jornadaFin, fechaEditada]);

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
            diasUsar,
            tipoSolicitud: tipo,
            ...(tipo === "ADMINISTRATIVO" && {
                jornadaInicio,
                jornadaTermino: jornadaFin,
            }),
            ...(subrogancia && {
                subrogancia
            }),
        };

        const confirm = await Swal.fire({
            icon: 'question',
            title: 'Confirmar Solicitud',
            text: '¿Estás seguro de realizar esta solicitud?',
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
            console.error("Error al enviar solicitud:", error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un problema al enviar la solicitud.' });
        } finally {
            setEnviando(false);
        }
    }, [solicitud, rut, fechaInicio, fechaFin, depto, diasUsar, tipo, jornadaInicio, jornadaFin, subrogancia, resetErrors]);

    const submitForm = async (e, esJefe, esDirector) => {
        e.preventDefault();

        const isValid = validarFechas(fechaInicio, fechaFin);
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
            const existe = await getSolicitudByFechaInicioAndTipo(rut, fechaInicio, tipo);
            if (existe) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Ya existe una solicitud',
                    text: 'Tienes una solicitud en este mismo rango de fechas.',
                });
                return;
            }

            if (esJefe && !esDirector && !subrogancia) {
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
                return;
            }

            await handleSaveSolicitud();

        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un problema al enviar la solicitud. Intenta nuevamente.',
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

    const hasErrors = !!errorSaldo || !!errorFecha || !!errorFeriado || !!errorRangoFechas;

    return {
        tipo, handlerTipo, // Return new handler
        fechaInicio, handlerFechaInicio,
        fechaFin, handlerFechaFin,
        jornadaInicio, setJornadaInicio,
        jornadaFin, setJornadaFin,
        diasUsar,
        saldo,
        error: hasErrors,
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
