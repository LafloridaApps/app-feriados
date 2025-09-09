import PropTypes from "prop-types";
import ResumenAdministrativos from "./ResumenAdministrativos";
import DetalleAdministrativos from "./DetalleAdministrativos";
import { useAdministrativosTabs } from "../../../hooks/useAdministrativosTabs";

const TabsAdministrativos = ({ resumen, detalle }) => {
    const { activeYear, setActiveYear, detallePorAnio, years } = useAdministrativosTabs(detalle);

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
                    <ResumenAdministrativos resumen={resumen} />
                    <h5 className="text-success d-none d-md-block"><i className="bi bi-list-ul me-2"></i> Detalle {activeYear}</h5>
                    <div className="d-none d-md-block">
                        <DetalleAdministrativos detalle={detallePorAnio[activeYear] || []} />
                    </div>
                </>
            )}
        </>
    );
};

TabsAdministrativos.propTypes = {
    resumen: PropTypes.arrayOf(
        PropTypes.shape({
            anio: PropTypes.number.isRequired,
            maximo: PropTypes.number.isRequired,
            usados: PropTypes.number.isRequired,
            saldo: PropTypes.number.isRequired,
        })
    ).isRequired,
    detalle: PropTypes.arrayOf(
        PropTypes.shape({
            numero: PropTypes.string.isRequired,
            periodo: PropTypes.string.isRequired,
            fecha_resolucion: PropTypes.string.isRequired,
            fecha_inicio: PropTypes.string.isRequired,
            fecha_termino: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default TabsAdministrativos;