import { FaBuilding, FaEdit } from 'react-icons/fa';
const ResultadosSubrogancia = ({
    searchResults,
    handleEditClick,
    isSaving,
    resolverCargoCeroPapel,
    setIsSaving
}) => (
    <>
        <h5 className="section-title mt-5"><FaBuilding /> Resultados</h5>
        <div className="table-responsive">
            <table className="results-table">
                <thead>
                    <tr>
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
                                <td>{res.nombreJefe}</td>
                                <td>{res.subrogante}</td>
                                <td>{res.departamento}</td>
                                <td>{res.fechaInicio}</td>
                                <td>{res.fechaFin}</td>
                                <td>
                                                        {res.puedeResolverCeroPapel && (
                                                            <button className="btn btn-sm btn-outline-warning me-2" disabled={isSaving} onClick={async () => {
                                                                setIsSaving(true);
                                                                try { await resolverCargoCeroPapel(res.idSubrogancia); }
                                                                finally { setIsSaving(false); }
                                                            }}>Elegir cargo</button>
                                                        )}
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
                            <td colSpan="6" className="text-center py-4 text-muted">Realiza una búsqueda para ver resultados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
);

export default ResultadosSubrogancia;
