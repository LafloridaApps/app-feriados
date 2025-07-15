import PropTypes from "prop-types";

const ResumenPermisos = ({ resumenAdm , resumenFer  }) => {
  
    const { maximo, usados, saldo } = resumenAdm || {};
    const {
        total,
        dias_tomados: usadosFer,
        dias_pendientes: saldoFer,
    } = resumenFer || {};

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-info text-white"><i className="bi bi-list-check me-2"></i> Resumen de Saldos</div>
            <div className="card-body">
                <table className="table table-hover table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th><i className="bi bi-tag-fill me-2"></i> Tipo</th>
                            <th><i className="bi bi-plus-square-fill me-2"></i> Total</th>
                            <th><i className="bi bi-arrow-down-square-fill me-2"></i> Usados</th>
                            <th><i className="bi bi-arrow-left-right me-2"></i> Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><i className="bi bi-sun-fill me-2"></i> Feriados</td>
                            <td>{total ?? "-"}</td>
                            <td>{usadosFer ?? "-"}</td>
                            <td>{saldoFer ?? "-"}</td>
                        </tr>
                        <tr>
                            <td><i className="bi bi-briefcase-fill me-2"></i> Administrativos</td>
                            <td>{maximo ?? "-"}</td>
                            <td>{usados ?? "-"}</td>
                            <td>{saldo ?? "-"}</td>
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