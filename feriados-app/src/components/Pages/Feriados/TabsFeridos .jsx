import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ResumenFeridos from "./ResumenFeridos ";
import DetalleFeridos from "./DetalleFeridos ";

const TabsFeridos = ({ resumen, detalle }) => {
    const currentYear = new Date().getFullYear();
    const [activeYear, setActiveYear] = useState(null);

   

   useEffect(() => {
        const availableYears = detalle.map((r) =>new Date(r.fechaInicio).getFullYear());
        if (availableYears.includes(currentYear)) {
            setActiveYear(currentYear);
        } else if (availableYears.length > 0) {
            setActiveYear(availableYears[0]);
        }


    }, [currentYear, detalle]);

     const resumenPorAnio = detalle.reduce((acc, r) => {
        acc[new Date(r.fechaResolucion).getFullYear()] = r;
        return acc;
    }, {});


    const detallePorAnio = detalle.reduce((acc, d) => {
        const anio = new Date(d.fechaResolucion).getFullYear();
        if (!acc[anio]) acc[anio] = [];
        acc[anio].push(d);
        return acc;
    }, {});


    const years = Object.keys(resumenPorAnio)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <>
            <ul className="nav nav-tabs mb-3">
                {years.map((anio) => (
                    <li className="nav-item" key={anio}>
                        <button
                            className={`nav-link ${anio === activeYear ? "active" : ""}`}
                            onClick={() => setActiveYear(anio)}
                        >
                            {anio}
                        </button>
                    </li>
                ))}
            </ul>
            {activeYear != null && (
                <>
                    <h5 className="text-primary"><i className="bi bi-bar-chart-line-fill me-2"></i> Resumen </h5>
                    <ResumenFeridos resumen={resumen} />
                    <h5 className="text-success d-none d-md-block"><i className="bi bi-list-ul me-2"></i> Detalle {activeYear}</h5>
                    <div className="d-none d-md-block">
                        <DetalleFeridos detalle={detallePorAnio[activeYear] || []} />
                    </div>
                </>
            )}
        </>
    );
};

TabsFeridos.propTypes = {
    resumen: PropTypes.arrayOf(
        PropTypes.shape({
            anio: PropTypes.number.isRequired,
            total: PropTypes.number.isRequired,
            dias_corresponden: PropTypes.number.isRequired,
            dias_acumulados: PropTypes.number.isRequired,
            dias_tomados: PropTypes.number.isRequired,
            dias_perdidos: PropTypes.number.isRequired,
            dias_pendientes: PropTypes.number.isRequired,
        })
    ).isRequired,
    detalle: PropTypes.arrayOf(
        PropTypes.shape({
            numero: PropTypes.number.isRequired,
            resolucion: PropTypes.string,
            periodo: PropTypes.number.isRequired,
            fecha_resolucion: PropTypes.string.isRequired,
            fecha_inicio: PropTypes.string.isRequired,
            fecha_termino: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default TabsFeridos;