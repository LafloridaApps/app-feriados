import { useState, useCallback } from 'react';
import { subroganciaService } from '../services/subroganciaService';
import { useAlertaSweetAlert } from './useAlertaSweetAlert';
import { validarRut } from '../services/utils';

export const useSubroganteForm = (fechaInicio, fechaFin, onSubroganteSelect) => {
    const [rut, setRut] = useState('');
    const [errors, setErrors] = useState({ mensaje: '', detalle: '' });
    const [subrogante, setSubrogante] = useState(null);
    const { mostrarAlertaError } = useAlertaSweetAlert();

    const buscarSubrogante = async () => {
        if (!rut) {
            setErrors({ mensaje: 'Por favor, ingrese un RUT', detalle: '' });
            return;
        }

        if (!validarRut(rut)) {
            setErrors({ mensaje: 'RUT inválido', detalle: 'El formato del RUT debe ser 12345678k' });
            return;
        }

        if (!fechaInicio || !fechaFin) {
            mostrarAlertaError('Debe seleccionar la fecha de inicio y fin de la solicitud.');
            return;
        }
        setErrors({ mensaje: '', detalle: '' });
        try {
            const rutSinDv = rut.slice(0, -1);
            const data = await subroganciaService.buscarPorRut(rutSinDv, fechaInicio, fechaFin);
            if (data) {
                setSubrogante(data);
                onSubroganteSelect(data);
            } else {
                setErrors({ mensaje: 'No se encontró ningún funcionario con el RUT ingresado', detalle: '' });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                mostrarAlertaError(error.response.data.mensaje);
            } else {
                setErrors({ mensaje: 'Error al buscar el funcionario', detalle: '' });
            }
            console.error('Error al buscar por RUT:', error);
        }
    };

    const limpiarCampos = useCallback(() => {
        setRut('');
        setErrors({ mensaje: '', detalle: '' });
        setSubrogante(null);
    }, []);

    return {
        rut,
        setRut,
        errors,
        subrogante,
        buscarSubrogante,
        limpiarCampos,
    };
};