import { useState, useEffect, useContext } from 'react';
import { getFeriadosByRutAndIdent } from '../../../../services/feriadosService';
import { UsuarioContext } from '../../../../context/UsuarioContext';
import useTamanoVentana from '../../../../hooks/useTamanoVentana';

export const useFeriadosPage = () => {
    const { width } = useTamanoVentana(); // Obtener el ancho de la ventana
    const isMobile = width < 768; // Definir el breakpoint para móvil

    const funcionario = useContext(UsuarioContext);

    const [data, setData] = useState([]);

    useEffect(() => {
        if (funcionario) {
            const fetchPermisos = async () => {
                try {
                    const response = await getFeriadosByRutAndIdent(funcionario.rut, funcionario.ident);
                    console.log("getFeriadosByRutAndIdent - response:", response);
                    setData(response);
                } catch (error) {
                    console.error("Error al obtener funcionario:", error);
                }
            };
            void fetchPermisos();
        }
    }, [funcionario]);

    const resumen = {
        anio: data.anio || new Date().getFullYear(),
        total: data.total || 0,
        diasCorresponden: data.diasCorresponden || 0,
        diasPendientes: data.diasPendientes || 0,
        diasAcumulados: data.diasAcumulados || 0,
        diasTomados: data.diasTomados || 0,
    }
    const detalle = data.detalle || [];


    return { funcionario, isMobile, resumen, detalle };
};
