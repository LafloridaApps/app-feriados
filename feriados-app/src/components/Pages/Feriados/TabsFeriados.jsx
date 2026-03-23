import PropTypes from "prop-types";
import ResumenFeriados from "./ResumenFeriados";
import DetalleFeriados from "./DetalleFeriados";
import { useFeriadosTabs } from "../../../hooks/useFeriadosTabs";

const TabsFeriados = ({ resumen, detalle }) => {
    const { activeYear, setActiveYear, detallePorAnio, years } = useFeriadosTabs(detalle);

    return (
        <div className="tabs-feriados-container mt-2">
            <div className="row mb-4 align-items-end">
                <div className="col-md-4 col-lg-3">
                    <label htmlFor="year-select" className="form-label-premium">
                        <i className="bi bi-calendar3"></i> Seleccione un año:
                    </label>
                    <select 
                        id="year-select"
                        className="form-select form-select-premium" 
                        value={activeYear || ''} 
                        onChange={(e) => setActiveYear(Number.parseInt(e.target.value, 10))}
                    >
                        {years.map((anio) => (
                            <option key={anio} value={anio}>
                                {anio}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {activeYear != null && (
                <div className="mt-4">
                    <div className="card-header-premium mb-4">
                        <i className="bi bi-activity text-primary"></i>
                        <span>Resumen Consolidado</span>
                    </div>
                    <ResumenFeriados resumen={resumen} />
                    
                    <div className="card-header-premium mt-5 mb-4 d-none d-md-flex">
                        <i className="bi bi-list-stars text-success"></i>
                        <span>Detalle del Periodo {activeYear}</span>
                    </div>
                    <div className="d-none d-md-block">
                        <DetalleFeriados detalle={detallePorAnio[activeYear] || []} />
                    </div>
                </div>
            )}
        </div>
    );
};

TabsFeriados.propTypes = {
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

export default TabsFeriados;