// src/hooks/useSolicitudesNoLeidas.js

import { useContext } from "react";
import { SolicitudesNoLeidasContext } from "../context/SolicitudesNoLeidasContext";


export const useSolicitudesNoLeidas = () => {
    const context = useContext(SolicitudesNoLeidasContext);
    if (!context) {
        throw new Error("useSolicitudesNoLeidas debe usarse dentro de un SolicitudesNoLeidasProvider");
    }
    return context;
};
