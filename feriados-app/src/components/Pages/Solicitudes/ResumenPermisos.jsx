import PropTypes from "prop-types";
import useTamanoVentana from "../../../hooks/useTamanoVentana";

const ResumenPermisos = ({ resumenAdministrativo, resumenFeriados }) => {
    const { width: ancho } = useTamanoVentana();
    const esMovil = ancho < 768;

    const { maximo: maxAdm, usados: usadosAdm, saldo: saldoAdm } = resumenAdministrativo || {};
    const { total: totalFer, dias_tomados: usadosFer, dias_pendientes: saldoFer } = resumenFeriados || {};

    if (esMovil) {
        return (
            <div className="resumen-mobile-compact">
                <div className="rmc-row">
                    <span className="rmc-label"><i className="bi bi-sun-fill text-warning me-1"></i>Feriados Legales</span>
                    <span className="rmc-stat"><span className="rmc-sub">Total</span> {totalFer ?? "-"}</span>
                    <span className="rmc-stat"><span className="rmc-sub">Usados</span> <span className="text-danger">{usadosFer ?? "-"}</span></span>
                    <span className="rmc-stat rmc-saldo"><span className="rmc-sub">Saldo</span> <span className="text-primary fw-bold">{saldoFer ?? "-"}</span></span>
                </div>
                <div className="rmc-row">
                    <span className="rmc-label"><i className="bi bi-briefcase-fill text-info me-1"></i>Días Administrativos</span>
                    <span className="rmc-stat"><span className="rmc-sub">Total</span> {maxAdm ?? "-"}</span>
                    <span className="rmc-stat"><span className="rmc-sub">Usados</span> <span className="text-danger">{usadosAdm ?? "-"}</span></span>
                    <span className="rmc-stat rmc-saldo"><span className="rmc-sub">Saldo</span> <span className="text-primary fw-bold">{saldoAdm ?? "-"}</span></span>
                </div>
            </div>
        );
    }

    return (
        <div className="resumen-container">
            <div className="card-header-premium">
                <i className="bi bi-pie-chart-fill"></i>
                <span>Resumen de Saldos Disponibles</span>
            </div>
            <div className="table-responsive">
                <table className="resumen-table">
                    <thead>
                        <tr>
                            <th>Tipo de Permiso</th>
                            <th className="text-center">Días Totales</th>
                            <th className="text-center">Días Usados</th>
                            <th className="text-center">Saldo Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-sun-fill text-warning"></i>
                                    <span>Feriados Legales</span>
                                </div>
                            </td>
                            <td className="text-center fw-bold">{totalFer ?? "-"}</td>
                            <td className="text-center text-danger">{usadosFer ?? "-"}</td>
                            <td className="text-center text-primary fs-5">{saldoFer ?? "-"}</td>
                        </tr>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-briefcase-fill text-info"></i>
                                    <span>Días Administrativos</span>
                                </div>
                            </td>
                            <td className="text-center fw-bold">{maxAdm ?? "-"}</td>
                            <td className="text-center text-danger">{usadosAdm ?? "-"}</td>
                            <td className="text-center text-primary fs-5">{saldoAdm ?? "-"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

ResumenPermisos.propTypes = {
    resumenAdministrativo: PropTypes.shape({
        anio: PropTypes.number,
        maximo: PropTypes.number,
        usados: PropTypes.number,
        saldo: PropTypes.number,
    }),
    resumenFeriados: PropTypes.shape({
        anio: PropTypes.number,
        total: PropTypes.number,
        dias_tomados: PropTypes.number,
        dias_pendientes: PropTypes.number,
    }),
};


export default ResumenPermisos;