import PropTypes from "prop-types";
import useTamanoVentana from "../../../hooks/useTamanoVentana";

const ResumenPermisos = ({ resumenAdministrativo, resumenFeriados }) => {
    const { width: ancho } = useTamanoVentana();
    const esMovil = ancho < 768;

    const { maximo: maxAdm, usados: usadosAdm, saldo: saldoAdm } = resumenAdministrativo || {};
    const { total: totalFer, dias_tomados: usadosFer, dias_pendientes: saldoFer } = resumenFeriados || {};

    if (esMovil) {
        return (
            <div className="resumen-mobile-cards">
                <div className="resumen-card feriados">
                    <div className="resumen-card-header">
                        <i className="bi bi-sun-fill"></i>
                        <span>Feriados Legales</span>
                    </div>
                    <div className="resumen-card-grid">
                        <div className="resumen-card-stat">
                            <span className="label">Total</span>
                            <span className="value">{totalFer ?? "-"}</span>
                        </div>
                        <div className="resumen-card-stat">
                            <span className="label">Usados</span>
                            <span className="value text-danger">{usadosFer ?? "-"}</span>
                        </div>
                        <div className="resumen-card-stat highlight">
                            <span className="label">Saldo</span>
                            <span className="value text-primary">{saldoFer ?? "-"}</span>
                        </div>
                    </div>
                </div>

                <div className="resumen-card administrativos">
                    <div className="resumen-card-header">
                        <i className="bi bi-briefcase-fill"></i>
                        <span>Días Administrativos</span>
                    </div>
                    <div className="resumen-card-grid">
                        <div className="resumen-card-stat">
                            <span className="label">Total</span>
                            <span className="value">{maxAdm ?? "-"}</span>
                        </div>
                        <div className="resumen-card-stat">
                            <span className="label">Usados</span>
                            <span className="value text-danger">{usadosAdm ?? "-"}</span>
                        </div>
                        <div className="resumen-card-stat highlight">
                            <span className="label">Saldo</span>
                            <span className="value text-primary">{saldoAdm ?? "-"}</span>
                        </div>
                    </div>
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