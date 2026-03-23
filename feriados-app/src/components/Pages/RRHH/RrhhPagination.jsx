import React from 'react';
import PropTypes from 'prop-types';

const RrhhPagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    // Lógica para mostrar un rango de páginas en lugar de todas si son demasiadas
    const pagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
        startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination pagination-premium justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link shadow-sm border" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <i className="bi bi-chevron-left me-2"></i> Anterior
                    </button>
                </li>
                
                {startPage > 1 && (
                    <li className="page-item">
                        <button className="page-link shadow-sm border" onClick={() => onPageChange(1)}>1</button>
                    </li>
                )}
                {startPage > 2 && (
                    <li className="page-item disabled"><span className="page-link bg-transparent">...</span></li>
                )}

                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button className="page-link shadow-sm border" onClick={() => onPageChange(number)}>
                            {number}
                        </button>
                    </li>
                ))}

                {endPage < totalPages - 1 && (
                    <li className="page-item disabled"><span className="page-link bg-transparent">...</span></li>
                )}
                {endPage < totalPages && (
                    <li className="page-item">
                        <button className="page-link shadow-sm border" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
                    </li>
                )}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link shadow-sm border" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Siguiente <i className="bi bi-chevron-right ms-2"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

RrhhPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default RrhhPagination;
