import PropTypes from "prop-types";

const ResumenAdministrativos = ({ resumen }) => {

    const { anio, maximo, usados, saldo } = resumen || {};

    
    return (
        <div className="table-responsive">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th className="text-center">Año</th>
                        <th className="text-center">Máximo Permitido</th>
                        <th className="text-center">Días Usados</th>
                        <th className="text-center">Saldo Disponible</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={anio}>
                        <td className="text-center fw-bold">{anio}</td>
                        <td className="text-center text-muted">{maximo}</td>
                        <td className="text-center text-danger">{usados}</td>
                        <td className="text-center text-primary fw-bold fs-4">{saldo}</td>
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