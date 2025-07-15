// src/providers/SolicitudesNoLeidasProvider.jsx
import { useEffect, useCallback, useState, useContext, useMemo } from "react";
import { SolicitudesNoLeidasContext } from "../context/SolicitudesNoLeidasContext";
import { inboxSolicitudesByRut } from "../services/inboxSolicitudes";
import { UsuarioContext } from "../context/UsuarioContext";
import PropTypes from "prop-types";

export const SolicitudesNoLeidasProvider = ({ children }) => {
    const funcionario = useContext(UsuarioContext);
    const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);

    const fetchSolicitudes = useCallback(async () => {
        if (funcionario?.rut) {
            try {
                const data = await inboxSolicitudesByRut(funcionario.rut);
                const noLeidas = data.filter(
                    (sol) => sol.derivaciones?.[0] && !sol.derivaciones[0].recepcionada
                );
                setCantidadNoLeidas(noLeidas.length);
            } catch (error) {
                console.error("Error al obtener solicitudes:", error);
            }
        }
    }, [funcionario]);

    const contextValue = useMemo(() => ({
        cantidadNoLeidas,
        refetch: fetchSolicitudes
    }), [cantidadNoLeidas, fetchSolicitudes]);

    useEffect(() => {
        fetchSolicitudes();
    }, [fetchSolicitudes]);

    return (
        <SolicitudesNoLeidasContext.Provider value={contextValue}>
            {children}
        </SolicitudesNoLeidasContext.Provider>
    );
};

SolicitudesNoLeidasProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
