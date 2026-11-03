import { FaBuilding, FaEdit } from 'react-icons/fa';
const getStatusBadge = (estado) => {
    if (!estado) return null;
    const map = {
        'ACTIVA': { cls: 'badge-active', label: 'Activa' },
        'PROGRAMADA': { cls: 'badge-future', label: 'Programada' },
        'FINALIZADA': { cls: 'badge-past', label: 'Finalizada' },
    };
    const entry = map[estado.toUpperCase()] ?? { cls: 'badge-past', label: estado };
    return <span className={`badge-status ${entry.cls}`}>{entry.label}</span>;
};

const ResultadosSubrogancia = ({
    searchResults,
    handleEditClick
}) => (
    <>
        <h5 className="section-title mt-5"><FaBuilding /> Resultados</h5>
        <div className="table-responsive">
            <table className="results-table">
                <thead>
                    <tr>
                        <th>Estado</th>
                        <th>Jefe</th>
                        <th>Subrogante</th>
                        <th>Departamento</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.length > 0 ? (
                        searchResults.map((res, idx) => (
                            <tr key={`${res.nombreJefe}-${res.fechaInicio}-${idx}`}>
                                <td>{getStatusBadge(res.estado)}</td>
                                <td>{res.nombreJefe}</td>
                                <td>{res.subrogante}</td>
                                <td>{res.departamento}</td>
                                <td>{res.fechaInicio}</td>
                                <td>{res.fechaFin}</td>
                                <td>
                                    {res.estado?.toUpperCase() !== 'FINALIZADA' && (
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(res)} title="Editar">
                                            <FaEdit />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4 text-muted">Realiza una búsqueda para ver resultados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
);

export default ResultadosSubrogancia;
