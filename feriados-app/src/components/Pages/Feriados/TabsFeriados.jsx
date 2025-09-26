import PropTypes from "prop-types";
import ResumenFeriados from "./ResumenFeriados";
import DetalleFeriados from "./DetalleFeriados";
import { useFeriadosTabs } from "../../../hooks/useFeriadosTabs";

const TabsFeriados = ({ resumen, detalle }) => {
    const { activeYear, setActiveYear, detallePorAnio, years } = useFeriadosTabs(detalle);

    return (
        <>
            <div className="mb-3 col-md-3">
                <label htmlFor="year-select" className="form-label">Seleccione un año:</label>
                <select 
                    id="year-select"
                    className="form-select" 
                    value={activeYear || ''} 
                    onChange={(e) => setActiveYear(parseInt(e.target.value, 10))}
                >
                    {years.map((anio) => (
                        <option key={anio} value={anio}>
                            {anio}
                        </option>
                    ))}
                </select>
            </div>
            {activeYear != null && (
                <>
                    <h5 className="text-primary"><i className="bi bi-bar-chart-line-fill me-2"></i> Resumen </h5>
                    <ResumenFeriados resumen={resumen} />
                    <h5 className="text-success d-none d-md-block"><i className="bi bi-list-ul me-2"></i> Detalle {activeYear}</h5>
                    <div className="d-none d-md-block">
                        <DetalleFeriados detalle={detallePorAnio[activeYear] || []} />
                    </div>
                </>
            )}
        </>
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