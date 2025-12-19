import PropTypes from "prop-types";

const ResumenFeriados = ({ resumen }) => {



    console.log("ResumenAdministrativos - resumen:", resumen);
    const {
        total,
        diasCorresponden,
        diasAcumulados,
        diasTomados,
        diasPendientes,
        anio,
    } = resumen;

    return (
        <div className="card">
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th><i className="bi bi-calculator-fill me-2"></i> Total</th>
                                <th><i className="bi bi-check-circle-fill me-2"></i> Corresponden</th>
                                <th><i className="bi bi-plus-square-fill me-2"></i> Acumulados</th>
                                <th><i className="bi bi-arrow-down-square-fill me-2"></i> Usados</th>
                                <th><i className="bi bi-arrow-left-right me-2"></i> Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={anio}>
                                <td>{total}</td>
                                <td>{diasCorresponden}</td>
                                <td>{diasAcumulados}</td>
                                <td>{diasTomados}</td>
                                <td>{diasPendientes}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

ResumenFeriados.propTypes = {
    resumen: PropTypes.shape({
            total: PropTypes.number.isRequired,
            diasCorresponden: PropTypes.number.isRequired,
            diasAcumulados: PropTypes.number.isRequired,
            diasTomados: PropTypes.number.isRequired,
            diasPendientes: PropTypes.number.isRequired,
            anio: PropTypes.number.isRequired,
        })
    .isRequired,
};

export default ResumenFeriados;