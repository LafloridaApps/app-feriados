import PropTypes from "prop-types";

const ResumenFeriados = ({ resumen }) => {

    const {
        total,
        diasCorresponden,
        diasAcumulados,
        diasTomados,
        diasPendientes,
        anio,
    } = resumen;

    return (
        <div className="table-responsive">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th className="text-center">Total Días</th>
                        <th className="text-center">Corresponden</th>
                        <th className="text-center">Acumulados</th>
                        <th className="text-center">Usados</th>
                        <th className="text-center">Saldo Disponible</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={anio}>
                        <td className="text-center fw-bold fs-5">{total}</td>
                        <td className="text-center text-muted">{diasCorresponden}</td>
                        <td className="text-center text-muted">{diasAcumulados}</td>
                        <td className="text-center text-danger">{diasTomados}</td>
                        <td className="text-center text-primary fw-bold fs-4">{diasPendientes}</td>
                    </tr>
                </tbody>
            </table>
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