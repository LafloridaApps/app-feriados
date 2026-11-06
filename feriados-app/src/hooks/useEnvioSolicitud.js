import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { fechaActual } from '../services/utils';
import { getSolicitudByFechaInicioAndTipo, saveSolicitud } from '../services/solicitudService';

const initialState = {
    rut: 0,
    fechaSolicitud: "",
    fechaInicio: "",
    fechaFin: "",
    depto: "",
    tipoSolicitud: "",
};

export const useEnvioSolicitud = ({
    rut, depto, rutGestor, onSolicitudCreada,
    tipo, fechaInicio, fechaFin, jornadaInicio, jornadaFin,
    diasUsarFeriado, diasUsarAdministrativo,
    resumenAdministrativo, resumenFeriados, errorSaldo, errorBloqueDiezDias,
    validarFechas, mostrarAlertaError, resetFormulario,
}) => {
    const [enviando, setEnviando] = useState(false);
    const [subrogancia, setSubrogancia] = useState(null);
    const [mostrarModalSubrogante, setMostrarModalSubrogante] = useState(false);
    const [solicitud, setSolicitud] = useState(initialState);

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

        let tipoDisplay = tipo || 'Desconocido';
        if (tipo === 'FERIADO') {
            tipoDisplay = 'Feriado';
        } else if (tipo === 'ADMINISTRATIVO') {
            tipoDisplay = 'Administrativo';
        }

        const confirm = await Swal.fire({
            icon: 'question',
            title: 'Confirmar Solicitud',
            html: `
                    <p>¿Está seguro de enviar la solicitud con los siguientes detalles?</p>
                    <strong>Tipo:</strong> ${tipoDisplay}<br>
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


            const res = await saveSolicitud(nuevaSolicitud, rutGestor);
            await Swal.fire({
                icon: 'success',
                title: 'Solicitud enviada',
                html: `Tu solicitud fue creada con el ID <strong>${res.id}</strong> y derivada al depto <strong>${res.nombreDepartamento}</strong>.`,
            });
            setSolicitud(initialState);
            resetFormulario();
            setSubrogancia(null);
            onSolicitudCreada?.();
        } catch (error) {
            void Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Hubo un problema al enviar la solicitud.' });
        } finally {
            setEnviando(false);
        }
    }, [solicitud, rut, rutGestor, onSolicitudCreada, fechaInicio, fechaFin, depto, tipo, jornadaInicio, jornadaFin, subrogancia, diasUsarFeriado, diasUsarAdministrativo, resetFormulario]);

    const verificarConflictoFechas = async () => {
        const existe = await getSolicitudByFechaInicioAndTipo(rut, fechaInicio, tipo);
        if (!existe?.estado || ['POSTERGADA', 'ANULADA'].includes(existe.estado)) return false;

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

    const validarPreEnvio = async (esDirector) => {
        if (!resumenAdministrativo || !resumenFeriados) {
            mostrarAlertaError('Debes cargar los saldos del funcionario antes de enviar la solicitud.');
            return false;
        }
        const isValid = validarFechas(fechaInicio, fechaFin);

        if (errorBloqueDiezDias) {
            await Swal.fire({
                icon: 'warning',
                title: 'Ley N°18.883 — Bloque de 10 días',
                text: errorBloqueDiezDias,
                confirmButtonText: 'Entendido',
            });
            return false;
        }

        if (!isValid || errorSaldo) {
            mostrarAlertaError(errorSaldo || 'Existen errores en las fechas seleccionadas.');
            return false;
        }

        // Validacion de subrogancia para directores
        if (esDirector && !subrogancia) {
            await Swal.fire({
                icon: 'info',
                title: 'Subrogante Requerido',
                text: 'Como director, es obligatorio que designe un subrogante.'
            });
            setMostrarModalSubrogante(true);
            return false;
        }

        return true;
    };

    const flujoSubrogante = async (esJefe, esDirector) => {
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
    };

    const submitForm = async (e, esJefe, esDirector) => {
        e.preventDefault();

        if (!await validarPreEnvio(esDirector)) return;

        try {
            await flujoSubrogante(esJefe, esDirector);
        } catch (error) {
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

    return {
        enviando, submitForm, mostrarModalSubrogante, subrogancia,
        handleSubroganteSelected, hanglerEliminarSubrogancia, closeSubroganteModal,
    };
};
