import PaginacionFuncionarios from './PaginacionFuncionarios';

const ResultadosFuncionarios = ({
    searchTerm,
    funcionarios,
    selectedFuncionario,
    searching,
    error,
    searched,
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    handleSelectFuncionario
}) => (
    <>
        {/* Error */}
        {error && (
            <div className="alert alert-danger py-2">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
            </div>
        )}

        {/* Sin resultados */}
        {!searching && searched && funcionarios.length === 0 && !error && (
            <p className="text-muted text-center py-3">
                <i className="bi bi-person-x me-2"></i>No se encontraron funcionarios con «{searchTerm}»
            </p>
        )}

        {/* Tabla de resultados */}
        {!searching && funcionarios.length > 0 && (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">
                        <strong>{totalItems}</strong> funcionario(s) encontrado(s)
                        {totalPages > 1 && <> — Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong></>}
                    </small>
                    {selectedFuncionario && (
                        <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            <strong>{selectedFuncionario.nombreCompleto}</strong> seleccionado
                        </small>
                    )}
                </div>

                <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: 130 }}>RUT</th>
                                <th>Nombre Completo</th>
                                <th style={{ width: 110 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionarios.map((func) => {
                                const isSelected = selectedFuncionario?.rut === func.rut;
                                return (
                                    <tr
                                        key={func.rut}
                                        onClick={() => handleSelectFuncionario(func)}
                                        className={isSelected ? 'table-primary' : ''}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>
                                            <code className="small">{func.rut}-{func.vrut}</code>
                                        </td>
                                        <td>{func.nombreCompleto}</td>
                                        <td className="text-end">
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={(e) => { e.stopPropagation(); handleSelectFuncionario(func); }}
                                            >
                                                {isSelected ? <><i className="bi bi-check2 me-1"></i>Seleccionado</> : 'Seleccionar'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <PaginacionFuncionarios
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
        )}
    </>
);

export default ResultadosFuncionarios;
