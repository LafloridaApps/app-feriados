import { useState, useEffect, useMemo } from "react";

export const useFeriadosTabs = (detalle) => {
    const currentYear = new Date().getFullYear();
    const [activeYear, setActiveYear] = useState(null);

    const { detallePorAnio, years } = useMemo(() => {
        const detallePorAnio = detalle.reduce((acc, d) => {
            const anio = new Date(d.fechaResolucion).getFullYear();
            if (!acc[anio]) acc[anio] = [];
            acc[anio].push(d);
            return acc;
        }, {});

        const years = Object.keys(detallePorAnio)
            .map(Number)
            .sort((a, b) => b - a);

        return { detallePorAnio, years };
    }, [detalle]);

    useEffect(() => {
        if (years.includes(currentYear)) {
            setActiveYear(currentYear);
        } else if (years.length > 0) {
            setActiveYear(years[0]);
        }
    }, [years, currentYear]);

    return {
        activeYear,
        setActiveYear,
        detallePorAnio,
        years
    };
};