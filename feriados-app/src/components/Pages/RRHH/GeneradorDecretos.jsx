import PropTypes from 'prop-types';
import FiltrosGeneradorDecretos from './GeneradorDecretos/FiltrosGeneradorDecretos';
import AccionesGeneradorDecretos from './GeneradorDecretos/AccionesGeneradorDecretos';
import ResultadosGeneradorDecretos from './GeneradorDecretos/ResultadosGeneradorDecretos';

const GeneradorDecretos = (props) => {
    return (
        <div className="container-fluid py-4 generador-decretos-container">
            {/* Standardized Page Header - Premium Style */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-1 text-primary fw-bold">
                        <i className="bi bi-file-earmark-medical me-2"></i>{' '}
                        Generador de Decretos
                    </h2>
                    <p className="text-muted mb-0">
                        Procesa las aprobaciones y genera los documentos oficiales
                    </p>
                </div>
            </div>

            <div className="accordion accordion-premium mb-5" id="accordionGeneradorDecretos">
                {/* Step 1: Filters */}
                <FiltrosGeneradorDecretos {...props} />

                {/* Step 2: Actions */}
                <AccionesGeneradorDecretos {...props} />
            </div>

            <ResultadosGeneradorDecretos {...props} />
        </div>
    );
};

GeneradorDecretos.propTypes = {
    fechaDesde: PropTypes.string.isRequired,
    setFechaDesde: PropTypes.func.isRequired,
    fechaHasta: PropTypes.string.isRequired,
    setFechaHasta: PropTypes.func.isRequired,
    handleCargarAprobaciones: PropTypes.func.isRequired,
    handleLimpiarFiltros: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedItemsCount: PropTypes.number.isRequired,
    handleGenerarDecreto: PropTypes.func.isRequired,
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
    selectedTipoContrato: PropTypes.array.isRequired,
    handleTipoContratoChange: PropTypes.func.isRequired,
    tipoContratoOptions: PropTypes.array.isRequired,
    selectedTipoSolicitud: PropTypes.string.isRequired,
    setSelectedTipoSolicitud: PropTypes.func.isRequired,
    tipoSolicitudOptions: PropTypes.array.isRequired,
};

export default GeneradorDecretos;
