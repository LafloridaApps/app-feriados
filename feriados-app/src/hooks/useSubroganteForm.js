
import { useState, useCallback } from 'react';

export const useSubroganteForm = () => {
    const [rut, setRut] = useState('');
    const [errors, setErrors] = useState({ mensaje: '', detalle: '' });
    const [subrogante, setSubrogante] = useState(null);

    const limpiarCampos = useCallback(() => {
        setRut('');
        setErrors({ mensaje: '', detalle: '' });
        setSubrogante(null);
    }, []);

    return {
        rut,
        setRut,
        errors,
        setErrors,
        subrogante,
        setSubrogante,
        limpiarCampos,
    };
};
