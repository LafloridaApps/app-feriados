import { useState, useEffect } from 'react';
import { useUsuario } from '../../../../hooks/useUsuario';
import axios from 'axios';
import { BASE_URL } from '../../../../services/url';

export const useInformesTab = () => {
    const funcionario = useUsuario();
    const codDeptoUsuario = funcionario?.codDepto || '';

    const [filtroDepto, setFiltroDepto] = useState('todos');
    const [filtroAnio, setFiltroAnio] = useState(new Date().getFullYear().toString());
    const [informesData, setInformesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInformes = async () => {
            if (!codDeptoUsuario) return;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${BASE_URL}/solicitudes/dashboard/resumen-permisos`, {
                    params: {
                        codDeptoUsuario,
                        anio: filtroAnio,
                        codDeptoFiltro: filtroDepto
                    }
                });
                setInformesData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Error al obtener los datos del informe');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        void fetchInformes();
    }, [codDeptoUsuario, filtroAnio, filtroDepto]);

    return {
        filtroDepto, setFiltroDepto, filtroAnio, setFiltroAnio,
        informesData, loading, error,
    };
};
