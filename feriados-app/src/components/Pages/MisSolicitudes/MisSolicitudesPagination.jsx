const MisSolicitudesPagination = ({ currentPage, totalPages, setCurrentPage, solicitudesLength, totalElements }) => {
    return (
        <div className="card-footer text-muted d-flex justify-content-between align-items-center">
            <span>Mostrando {solicitudesLength} de {totalElements} solicitudes.</span>
            <nav>
                <ul className="pagination pagination-sm mb-0 flex-wrap">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(index)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MisSolicitudesPagination;