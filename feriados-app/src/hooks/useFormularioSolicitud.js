import { useState, useEffect, useContext, useCallback } from "react";
import Swal from 'sweetalert2';
import { calculoDiasAusar, fechaActual } from "../services/utils";
import { getSolicitudByFechaAndTipo, saveSolicitud } from '../services/solicitudService';
import { UsuarioContext } from "../context/UsuarioContext";
import { FeriadosContext } from "../context/FeriadosContext";
import { useDateValidation } from "./useDateValidation";
import { getDireccionByIdDepto } from "../services/funcionarioService";

const initialState = {
    rut: 0,
    fechaSolicitud: "",
    fechaInicio: "",
    fechaFin: "",
    depto: "",
    tipoSolicitud: "",
};

export const useFormularioSolicitud = ({ resumenAdm, resumenFer, detalleAdm, detalleFer }) => {
    const [tipo, setTipo] = useState("FERIADO");
    const [fechaInicio, setFechaInicio] = useState(fechaActual());
    const [fechaFin, setFechaFin] = useState(fechaActual());
    const [diasUsarFeriado, setDiasUsarFeriado] = useState(null);
    const [diasUsarAdministrativo, setDiasUsarAdministrativo] = useState(null);
    const [saldoFeriado, setSaldoFeriado] = useState(0);
    const [saldoAdministrativo, setSaldoAdministrativo] = useState(0);
    const [enviando, setEnviando] = useState(false);
    const [subrogancia, setSubrogancia] = useState(null);
    const [mostrarModalSubrogante, setMostrarModalSubrogante] = useState(false);
    const [fechaEditada, setFechaEditada] = useState("inicio");
    const [solicitud, setSolicitud] = useState(initialState);
    const [jornadaInicio, setJornadaInicio] = useState("AM");
    const [jornadaFin, setJornadaFin] = useState("PM");
    const [errorSaldo, setErrorSaldo] = useState("");



    const funcionario = useContext(UsuarioContext);
    const feriados = useContext(FeriadosContext);
    const fechasFeriadas = feriados.map(f => f.fecha);
    const rut = funcionario?.rut;
    const depto = funcionario?.codDepto;
    const codDeptoJefe = funcionario?.codDeptoJefe

    const {
        errorFecha,
        errorFeriado,
        errorRangoFechas,
        validarFechas,
        resetErrors
    } = useDateValidation(fechasFeriadas, detalleFer, detalleAdm, tipo, fechaInicio);



    const calcularFechaFinPropuesta = useCallback(async (inicio, cantidadDias) => {
        if (!inicio || cantidadDias <= 0) return inicio;
        let fecha = new Date(inicio);
        let sumados = 0;

        while (sumados < cantidadDias) {
            fecha.setDate(fecha.getDate() + 1);
            const iso = fecha.toISOString().split("T")[0];
            const esFeriado = fechasFeriadas.includes(iso);
            const esFinDeSemana = fecha.getDay() === 0 || fecha.getDay() === 6;
            if (!esFeriado && !esFinDeSemana) sumados++;
        }

        return fecha.toISOString().split("T")[0];
    }, [fechasFeriadas]);

    const calcularFechaInicioPropuesta = useCallback(async (fin, cantidadDias) => {
        if (!fin || cantidadDias <= 0) return fin;
        let fecha = new Date(fin);
        let restados = 0;

        while (restados < cantidadDias) {
            fecha.setDate(fecha.getDate() - 1);
            const iso = fecha.toISOString().split("T")[0];
            const esFeriado = fechasFeriadas.includes(iso);
            const esFinDeSemana = fecha.getDay() === 0 || fecha.getDay() === 6;
            if (!esFeriado && !esFinDeSemana) restados++;
        }

        return fecha.toISOString().split("T")[0];
    }, [fechasFeriadas]);

    const diasUsar = tipo === "FERIADO" ? diasUsarFeriado : diasUsarAdministrativo;
    const saldo = tipo === "FERIADO" ? saldoFeriado : saldoAdministrativo;

    useEffect(() => {
        const actualizar = async () => {
            const diasDisponibles = tipo === "FERIADO"
                ? resumenFer?.dias_pendientes
                : resumenAdm?.saldo;

            if (diasDisponibles == null) return;

            if (diasDisponibles <= 0) {
                if (tipo === "FERIADO") {
                    setDiasUsarFeriado(null);
                    setSaldoFeriado(0);
                } else {
                    setDiasUsarAdministrativo(null);
                    setSaldoAdministrativo(0);
                }
                return;
            }

            let nuevaInicio = fechaInicio;
            let nuevaFin = fechaFin;

            if (fechaEditada === "inicio") {
                nuevaFin = await calcularFechaFinPropuesta(fechaInicio, diasDisponibles - 1);
                setFechaFin(nuevaFin);
            } else if (fechaEditada === "fin") {
                nuevaInicio = await calcularFechaInicioPropuesta(fechaFin, diasDisponibles - 1);
                setFechaInicio(nuevaInicio);
            }

            const total = await calculoDiasAusar(nuevaInicio, nuevaFin, tipo, jornadaInicio, jornadaFin);

            if (tipo === "FERIADO") {
                setDiasUsarFeriado(total);
                const nuevo = resumenFer.dias_pendientes - total;
                setSaldoFeriado(nuevo);
                setErrorSaldo(nuevo < 0 ? "No tienes saldo suficiente para este permiso." : "");
            } else {
                setDiasUsarAdministrativo(total);
                const nuevo = resumenAdm.saldo - total;
                setSaldoAdministrativo(nuevo);
                setErrorSaldo(nuevo < 0 ? "No tienes saldo suficiente para este permiso." : "");
            }

            validarFechas(nuevaInicio, nuevaFin);
        };

        actualizar();
    }, [
        fechaInicio,
        fechaFin,
        fechaEditada,
        tipo,
        jornadaInicio,
        jornadaFin,
        resumenFer,
        resumenAdm,
        calcularFechaFinPropuesta,
        calcularFechaInicioPropuesta,
        validarFechas
    ]);

    useEffect(() => {
        setFechaEditada("inicio");
    }, [tipo]);

    const handlerFechaInicio = useCallback((e) => {
        setFechaInicio(e.target.value);
        setFechaEditada("inicio");
    }, []);

    const handlerFechaFin = useCallback((e) => {
        setFechaFin(e.target.value);
        setFechaEditada("fin");
    }, []);

    const mostrarAlertaError = useCallback((mensaje) => {
        Swal.fire({ icon: 'error', title: 'Oops...', text: mensaje });
    }, []);

    useEffect(() => {
        if (errorSaldo) mostrarAlertaError(errorSaldo);
        if (errorFecha) mostrarAlertaError(errorFecha);
        if (errorFeriado) mostrarAlertaError(errorFeriado);
        if (errorRangoFechas) mostrarAlertaError(errorRangoFechas);
    }, [errorSaldo, errorFecha, errorFeriado, errorRangoFechas, mostrarAlertaError]);


    const handerAgregaDirectorSubrante = async (id)=>{

        try{
             const dataDirector = await getDireccionByIdDepto(id, fechaInicio,fechaInicio)
               console.log(dataDirector)

        }catch(error) {
            console.log(error);
        }
       
      
    }


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
                subroganteRut: subrogancia.rut,
                subroganteNombre: subrogancia.nombre,
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
    }, [solicitud, rut, fechaInicio, fechaFin, depto, tipo, jornadaInicio, jornadaFin, subrogancia, resetErrors]);

    const submitForm = async (e, esJefe, esDirector) => {
        e.preventDefault();
        setEnviando(true);

        try {
            // Validar fechas y saldo
            const isValid = validarFechas(fechaInicio, fechaFin);
            if (!isValid || errorSaldo) {
                setEnviando(false);
                return;
            }

            // Validar si ya existe una solicitud en ese rango de fechas
            const existe = await getSolicitudByFechaAndTipo(rut, fechaInicio, tipo);
            if (existe) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Ya existe una solicitud',
                    text: 'Tienes una solicitud en este mismo rango de fechas.',
                });
                setEnviando(false);
                return;
            }

            // Caso: Jefe y Director sin subrogante => debe agregar subrogante
            if (esJefe && esDirector && !subrogancia) {
                setMostrarModalSubrogante(true);
                return;
            }

            // Caso: Solo jefe sin subrogante => preguntar si agrega subrogante o deja que firme el director
            if (esJefe && !esDirector && !subrogancia) {
                const { isConfirmed } = await Swal.fire({
                    icon: 'question',
                    title: '¿Deseas agregar un subrogante?',
                    text: 'Puedes agregar un subrogante o dejar que firme el director.',
                    confirmButtonText: 'Agregar subrogante',
                    cancelButtonText: 'Firmará el director',
                    showCancelButton: true,
                });

                if (isConfirmed) {
                    setMostrarModalSubrogante(true);
                    return;
                } else {
                    handerAgregaDirectorSubrante(depto)
                    return;
                }
            }

            // Si pasó todas las validaciones y condiciones anteriores
            await handleSaveSolicitud();

        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Ocurrió un problema al enviar la solicitud. Intenta nuevamente.',
            });
        } finally {
            setEnviando(false);
        }
    };


    const handleSubroganteSelected = (subrogancia) => {
        subrogancia = {
            ...subrogancia, fechaInicio: fechaInicio, fechaFin: fechaFin

        };

        setSubrogancia(subrogancia);
        setMostrarModalSubrogante(false);
    };

    const hanglerEliminarSubrogancia = () => {
        setSubrogancia(null);
        setMostrarModalSubrogante(false);
    };

    const closeSubroganteModal = () => {
        setMostrarModalSubrogante(false);
        setEnviando(false);
    };

    const hasErrors = !!errorSaldo || !!errorFecha || !!errorFeriado || !!errorRangoFechas;


    return {
        tipo, setTipo,
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
        hanglerEliminarSubrogancia
    };
};
