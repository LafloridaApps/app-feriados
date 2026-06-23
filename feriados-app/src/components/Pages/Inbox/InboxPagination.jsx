import PropTypes from 'prop-types';

const InboxPagination = ({ currentPage, totalPages, totalElements, itemsToDisplay, handlePageChange, isMobile }) => {
    if (totalPages === null) return null;

    const pageNumbers = () => {
        const pages = [];
        const delta = 1;
        const start = Math.max(1, currentPage - delta);
        const end = Math.min(totalPages - 2, currentPage + delta);

        pages.push({ type: 'page', value: 0 });
        if (start > 1) pages.push({ type: 'ellipsis', id: 'start' });
        for (let i = start; i <= end; i++) pages.push({ type: 'page', value: i });
        if (end < totalPages - 2) pages.push({ type: 'ellipsis', id: 'end' });
        if (totalPages > 1) pages.push({ type: 'page', value: totalPages - 1 });

        return pages;
    };

    return (
        <div className={`card-footer ${isMobile ? 'flex-column align-items-stretch text-center' : 'd-flex justify-content-between align-items-center'}`}>
            {!isMobile && (
                <div className="text-muted small">
                    Mostrando {itemsToDisplay.length} de {totalElements} solicitudes
                </div>
            )}
            <nav className={`${isMobile ? 'd-flex justify-content-between align-items-center' : ''}`}>
                <ul className={`pagination ${isMobile ? '' : 'pagination-sm'} mb-0 ${isMobile ? '' : 'justify-content-center'}`}>
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Anterior">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                    </li>
                    {isMobile ? (
                        <li className="page-item disabled">
                            <span className="page-link">{currentPage + 1} / {totalPages}</span>
                        </li>
                    ) : (
                        pageNumbers().map((page) =>
                            page.type === 'ellipsis' ? (
                                <li key={`ellipsis-${page.id}`} className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            ) : (
                                <li key={page.value} className={`page-item ${page.value === currentPage ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page.value)}>
                                        {page.value + 1}
                                    </button>
                                </li>
                            )
                        )
                    )}
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Siguiente">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

InboxPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number,
    totalElements: PropTypes.number,
    itemsToDisplay: PropTypes.array.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
};

export default InboxPagination;
