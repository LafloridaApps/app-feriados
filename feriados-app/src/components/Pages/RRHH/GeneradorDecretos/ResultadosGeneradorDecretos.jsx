import PropTypes from 'prop-types';
import TablaDecretos from '../TablaDecretos';
import RrhhPagination from '../RrhhPagination';

const ResultadosGeneradorDecretos = ({
    currentAprobaciones,
    totalElements,
    selectedItems,
    onSelectItem,
    onSelectAll,
    requestSort,
    sortConfig,
    componentPage,
    itemsPerPage,
    handlePageChange
}) => {
    const totalPages = Math.ceil(totalElements / itemsPerPage);

    return (
        currentAprobaciones.length > 0 && (
            <div className="bg-white p-4 rounded shadow-sm border">
                <div className="d-flex align-items-center gap-2 mb-4">
                    <i className="bi bi-table text-primary fs-4"></i>
                    <h4 className="mb-0 fw-bold">Resultados de la Búsqueda</h4>
                    <span className="badge bg-light text-dark border ms-2">
                        {totalElements} registros encontrados
                    </span>
                </div>

                <TablaDecretos
                    data={currentAprobaciones}
                    selectedItems={selectedItems}
                    onSelectItem={onSelectItem}
                    onSelectAll={onSelectAll}
                    requestSort={requestSort}
                    sortConfig={sortConfig}
                />

                <div className="mt-4 pt-4 border-top">
                    <RrhhPagination
                        currentPage={componentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        )
    );
};

ResultadosGeneradorDecretos.propTypes = {
    currentAprobaciones: PropTypes.array.isRequired,
    totalElements: PropTypes.number.isRequired,
    selectedItems: PropTypes.array.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    requestSort: PropTypes.func.isRequired,
    sortConfig: PropTypes.object.isRequired,
    componentPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func.isRequired,
};

export default ResultadosGeneradorDecretos;
