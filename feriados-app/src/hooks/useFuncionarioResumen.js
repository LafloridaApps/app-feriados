import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';
import { getResumenInicioByRut } from '../services/resumenFuncService';

export const useFuncionarioResumen = () => {
    const funcionario = useContext(UsuarioContext);
    const [resumenFunc, setResumenFunc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (funcionario && funcionario.rut) {
            const fetchResumen = async () => {
                try {
                    setLoading(true);
                    const response = await getResumenInicioByRut(funcionario.rut);
                    setResumenFunc(response);
                } catch (err) {
                    setError(err);
                    console.error("Error fetching resumen:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchResumen();
        }
    }, [funcionario]);

    return { resumenFunc, loading, error };
};