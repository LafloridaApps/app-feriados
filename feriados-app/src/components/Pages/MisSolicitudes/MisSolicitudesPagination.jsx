import PropTypes from 'prop-types';

const MisSolicitudesPagination = ({ currentPage, totalPages, setCurrentPage, solicitudesLength, totalElements }) => {
    return (
        <div className="card-footer text-muted d-flex justify-content-between align-items-center">
            <span>Mostrando {solicitudesLength} de {totalElements} solicitudes.</span>
            <nav>
                <ul className="pagination pagination-sm mb-0 flex-wrap">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i).map((pageNumber) => (
                        <li key={`page-${pageNumber}`} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(pageNumber)}>{pageNumber + 1}</button>
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

MisSolicitudesPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    solicitudesLength: PropTypes.number.isRequired,
    totalElements: PropTypes.number.isRequired,
};

export default MisSolicitudesPagination;