import PropTypes from 'prop-types';

const ResultadosEliminarDecretos = ({ results, selectedDecretos, handleSelectDecreto, handleSelectAllDecretos, searchPerformed }) => {
    if (results.length === 0) {
        return searchPerformed ? (
            <div className="empty-state-premium">
                <i className="bi bi-search text-info"></i>
                <h4>Sin decretos encontrados</h4>
                <p>No se registraron decretos en el periodo seleccionado.</p>
            </div>
        ) : null;
    }

    return (
        <div className="table-responsive">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th className="px-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedDecretos.length === results.length && results.length > 0}
                                onChange={handleSelectAllDecretos}
                            />
                        </th>
                        <th>Nro. Decreto</th>
                        <th>Fecha de Generación</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map(decreto => (
                        <tr key={decreto.id}>
                            <td className="px-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedDecretos.includes(decreto.id)}
                                    onChange={() => handleSelectDecreto(decreto.id)}
                                />
                            </td>
                            <td className="fw-bold">#{decreto.id}</td>
                            <td className="text-muted">{decreto.fechaDecreto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

ResultadosEliminarDecretos.propTypes = {
    results: PropTypes.array.isRequired,
    selectedDecretos: PropTypes.array.isRequired,
    handleSelectDecreto: PropTypes.func.isRequired,
    handleSelectAllDecretos: PropTypes.func.isRequired,
    searchPerformed: PropTypes.bool.isRequired,
};

export default ResultadosEliminarDecretos;
