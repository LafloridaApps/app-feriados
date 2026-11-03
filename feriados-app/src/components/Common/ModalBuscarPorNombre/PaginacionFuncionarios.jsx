const PaginacionFuncionarios = ({ currentPage, totalPages, handlePageChange }) => {
    const getVisiblePages = () => {
        const range = 2;
        const start = Math.max(0, currentPage - range);
        const end = Math.min(totalPages - 1, currentPage + range);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        totalPages > 1 && (
            <nav className="mt-3 d-flex justify-content-center">
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                        <button type="button" className="page-link" onClick={() => handlePageChange(0)} title="Primera página">
                            <i className="bi bi-chevron-double-left"></i>
                        </button>
                    </li>
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                        <button type="button" className="page-link" onClick={() => handlePageChange(currentPage - 1)} title="Página anterior">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                    </li>
                    {getVisiblePages().map(i => (
                        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                            <button type="button" className="page-link" onClick={() => handlePageChange(i)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                        <button type="button" className="page-link" onClick={() => handlePageChange(currentPage + 1)} title="Página siguiente">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                        <button type="button" className="page-link" onClick={() => handlePageChange(totalPages - 1)} title="Última página">
                            <i className="bi bi-chevron-double-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        )
    );
};

export default PaginacionFuncionarios;
