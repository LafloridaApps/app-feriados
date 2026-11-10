import { useState, useContext, useCallback } from 'react';
import { fechaActual } from '../services/utils';
import { UsuarioContext } from '../context/UsuarioContext';
import { FeriadosContext } from '../context/FeriadosContext';
import { SolicitudTerceroContext } from '../context/SolicitudTerceroContext';
import { useCalculoPermisos } from './useCalculoPermisos';
import { useEnvioSolicitud } from './useEnvioSolicitud';

const extractTipoValue = (e) => {
    let newTipo = '';

    if (e?.target?.value !== undefined) {
        newTipo = e.target.value;
    } else if (e?.value !== undefined) {
        newTipo = e.value;
    } else if (typeof e === 'string') {
        newTipo = e;
    }

    if (typeof newTipo === 'object' && newTipo !== null) {
        newTipo = newTipo?.value || newTipo?.label || '';
    }

    return String(newTipo) === '[object Object]' ? '' : String(newTipo);
};

export const useFormularioSolicitud = ({ resumenAdministrativo, resumenFeriados, detalleFeriados }) => {
    const [tipo, setTipo] = useState('');
    const [fechaInicio, setFechaInicio] = useState(fechaActual());
    const [fechaFin, setFechaFin] = useState(fechaActual());
    const [jornadaInicioElegida, setJornadaInicioElegida] = useState('AM');
    const [jornadaFinElegida, setJornadaFinElegida] = useState('PM');
    const [fechaEditada, setFechaEditada] = useState('inicio');

    const funcionario = useContext(UsuarioContext);
    const { rutGestor = null, onSolicitudCreada } = useContext(SolicitudTerceroContext) ?? {};
    const feriados = useContext(FeriadosContext);
    const fechasFeriadas = feriados.map(f => f.fecha);
    const permiteMedioDia = ['PLANTA', 'CONTRATA', 'SUPLENCIA', 'SUPLENTE EXTERNO'].includes(
        String(funcionario?.tipoContrato ?? '').trim().toUpperCase()
    );
    const jornadasBloqueadas = tipo === 'ADMINISTRATIVO' && !permiteMedioDia;
    const jornadaInicio = jornadasBloqueadas ? 'AM' : jornadaInicioElegida;
    const jornadaFin = jornadasBloqueadas ? 'PM' : jornadaFinElegida;
    const rut = funcionario?.rut;
    const depto = funcionario?.codDepto;
    const codDeptoJefe = funcionario?.codDeptoJefe;

    const calculo = useCalculoPermisos({
        tipo, fechaInicio, fechaFin, setFechaFin, permiteMedioDia,
        jornadaInicio, jornadaFin, setJornadaFin: setJornadaFinElegida, fechaEditada,
        resumenAdministrativo, resumenFeriados, detalleFeriados, fechasFeriadas,
    });
    const { sincronizarJornada, resetCalculo } = calculo;

    const resetFormulario = useCallback(() => {
        setFechaInicio(fechaActual());
        setFechaFin(fechaActual());
        resetCalculo();
    }, [resetCalculo]);

    const envio = useEnvioSolicitud({
        rut, depto, rutGestor, onSolicitudCreada,
        tipo, fechaInicio, fechaFin, jornadaInicio, jornadaFin,
        diasUsarFeriado: calculo.diasUsarFeriado,
        diasUsarAdministrativo: calculo.diasUsarAdministrativo,
        resumenAdministrativo, resumenFeriados,
        errorSaldo: calculo.errorSaldo,
        errorBloqueDiezDias: calculo.errorBloqueDiezDias,
        validarFechas: calculo.validarFechas,
        mostrarAlertaError: calculo.mostrarAlertaError,
        resetFormulario,
    });

    const handlerFechaInicio = useCallback((e) => {
        setFechaInicio(e.target.value);
        setFechaEditada('inicio');
    }, []);

    const handlerFechaFin = useCallback((e) => {
        setFechaFin(e.target.value);
        setFechaEditada('fin');
    }, []);

    const handlerTipo = useCallback((e) => {
        const newTipo = extractTipoValue(e);

        setTipo(newTipo);
        setFechaEditada('tipo');
        if (newTipo) {
            if (!fechaInicio) {
                setFechaInicio(fechaActual());
            }
            // Sincronizar inmediatamente la jornada para evitar parpadeos y cálculos en negativo
            if (newTipo === 'ADMINISTRATIVO') {
                sincronizarJornada(resumenAdministrativo?.saldo);
            }
        } else {
            setFechaInicio(fechaActual());
            setFechaFin(fechaActual());
        }
    }, [fechaInicio, resumenAdministrativo, sincronizarJornada]);

    return {
        tipo, handlerTipo,
        fechaInicio, handlerFechaInicio,
        fechaFin, handlerFechaFin,
        jornadaInicio, setJornadaInicio: setJornadaInicioElegida, jornadasBloqueadas,
        jornadaFin, setJornadaFin: setJornadaFinElegida,
        diasUsar: calculo.diasUsar,
        saldo: calculo.saldo,
        error: calculo.error,
        errorBloqueDiezDias: calculo.errorBloqueDiezDias,
        ...envio,
        rut, depto, codDeptoJefe,
        minDateInicio: calculo.minDateInicio,
        maxDateFin: calculo.maxDateFin,
    };
};
