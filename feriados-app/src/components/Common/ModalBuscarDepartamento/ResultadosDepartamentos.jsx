import PropTypes from 'prop-types';
import FilaDepartamento from './FilaDepartamento';

const ResultadosDepartamentos = ({ searchTerm, filteredDepartamentos, selectedDepto, setSelectedDepto }) => {
    return (
        <div className="table-responsive" style={{ maxHeight: '400px' }}>
            {searchTerm.trim().length > 1 ? (
                <table className="table table-hover table-sm align-middle mb-0">
                    <thead className="table-light sticky-top">
                        <tr>
                            <th style={{ width: '80px' }}>ID</th>
                            <th>Nombre del Departamento</th>
                            <th style={{ width: '120px' }} className="text-end">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDepartamentos.length > 0 ? (
                            filteredDepartamentos.map(depto => (
                                <FilaDepartamento key={depto.idDepto} depto={depto}
                                    selectedDepto={selectedDepto} setSelectedDepto={setSelectedDepto} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-muted">
                                    No se encontraron departamentos que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-building fs-1 mb-3 d-block opacity-25"></i>
                    <p>Ingrese al menos 2 caracteres para buscar un departamento...</p>
                </div>
            )}
        </div>
    );
};

ResultadosDepartamentos.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    filteredDepartamentos: PropTypes.array.isRequired,
    selectedDepto: PropTypes.object,
    setSelectedDepto: PropTypes.func.isRequired,
};

export default ResultadosDepartamentos;
