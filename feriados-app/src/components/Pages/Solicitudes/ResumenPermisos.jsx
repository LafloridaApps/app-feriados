import PropTypes from "prop-types";

const ResumenPermisos = ({ resumenAdm , resumenFer  }) => {
  
    const { maximo, usados, saldo } = resumenAdm || {};
    const {
        total,
        dias_tomados: usadosFer,
        dias_pendientes: saldoFer,
    } = resumenFer || {};

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
                            <td className="text-center fw-bold">{total ?? "-"}</td>
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
                            <td className="text-center fw-bold">{maximo ?? "-"}</td>
                            <td className="text-center text-danger">{usados ?? "-"}</td>
                            <td className="text-center text-primary fs-5">{saldo ?? "-"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

ResumenPermisos.propTypes = {
    resumenAdm: PropTypes.arrayOf(
        PropTypes.shape({
            anio: PropTypes.number.isRequired,
            maximo: PropTypes.number.isRequired,
            usados: PropTypes.number.isRequired,
            saldo: PropTypes.number.isRequired,
        })
    ).isRequired,
    resumenFer: PropTypes.arrayOf(
        PropTypes.shape({
            anio: PropTypes.number.isRequired,
            total: PropTypes.number.isRequired,
            dias_tomados: PropTypes.number.isRequired,
            dias_pendientes: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default ResumenPermisos;