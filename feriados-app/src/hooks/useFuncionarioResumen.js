import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';
import { getResumenInicioByRut } from '../services/resumenFuncService';

export const useFuncionarioResumen = () => {
    const funcionario = useContext(UsuarioContext);
    const [resumenFuncionario, setResumenFuncionario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (funcionario?.rut) {
            const obtenerResumenFuncionario = async () => {
                try {
                    setCargando(true);
                    const response = await getResumenInicioByRut(funcionario.rut);
                    setResumenFuncionario(response);
                } catch (err) {
                    setError(err);
                    console.error("Error al obtener resumen del funcionario:", err);
                } finally {
                    setCargando(false);
                }
            };
            obtenerResumenFuncionario();
        }
    }, [funcionario]);

    return { resumenFuncionario, cargando, error };
};