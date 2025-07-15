import PropTypes from "prop-types";

const ResumenFeridos = ({ resumen }) => {


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

ResumenFeridos.propTypes = {
    resumen: PropTypes.arrayOf(
        PropTypes.shape({
            total: PropTypes.number.isRequired,
            dias_corresponden: PropTypes.number.isRequired,
            dias_acumulados: PropTypes.number.isRequired,
            dias_tomados: PropTypes.number.isRequired,
            dias_perdidos: PropTypes.number,
            dias_pendientes: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default ResumenFeridos;