import PropTypes from "prop-types";

const ResumenAdministrativos = ({ resumen }) => {

    const { anio, maximo, usados, saldo } = resumen || {};

    
    return (
        <div className="table-responsive mb-4">
            <table className="table table-bordered table-hover table-striped align-middle">
                <thead >
                    <tr>
                        <th><i className="bi bi-calendar-event-fill me-2"></i> Año</th>
                        <th><i className="bi bi-infinity me-2"></i> Máximo</th>
                        <th><i className="bi bi-arrow-down-square-fill me-2"></i> Usados</th>
                        <th><i className="bi bi-arrow-left-right me-2"></i> Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={anio}>
                        <td>{anio}</td>
                        <td>{maximo}</td>
                        <td>{usados}</td>
                        <td>{saldo}</td>
                    </tr>

                </tbody>
            </table>
        </div>
    );
};

ResumenAdministrativos.propTypes = {
    resumen: PropTypes.arrayOf(
        PropTypes.shape({
            anio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            maximo: PropTypes.number.isRequired,
            usados: PropTypes.number.isRequired,
            saldo: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default ResumenAdministrativos;