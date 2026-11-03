import PropTypes from 'prop-types';
import RrhhFilters from '../RrhhFilters';

const FiltrosGeneradorDecretos = ({
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    handleCargarAprobaciones,
    handleLimpiarFiltros,
    loading,
    selectedTipoContrato,
    handleTipoContratoChange,
    tipoContratoOptions,
    selectedTipoSolicitud,
    setSelectedTipoSolicitud,
    tipoSolicitudOptions
}) => {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id="headingFiltros">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFiltros" aria-expanded="true" aria-controls="collapseFiltros">
                    <span className="step-indicator"></span> <strong>Búsqueda y Filtros de Datos</strong>
                </button>
            </h2>
            <div id="collapseFiltros" className="accordion-collapse collapse show" aria-labelledby="headingFiltros" data-bs-parent="#accordionGeneradorDecretos">
                <div className="accordion-body px-4 pb-4">
                    <RrhhFilters
                        fechaDesde={fechaDesde}
                        setFechaDesde={setFechaDesde}
                        fechaHasta={fechaHasta}
                        setFechaHasta={setFechaHasta}
                        handleCargarAprobaciones={() => handleCargarAprobaciones(0)} // Carga inicial
                        handleLimpiarFiltros={handleLimpiarFiltros}
                        loading={loading}
                        selectedTipoContrato={selectedTipoContrato}
                        handleTipoContratoChange={handleTipoContratoChange}
                        tipoContratoOptions={tipoContratoOptions}
                        selectedTipoSolicitud={selectedTipoSolicitud}
                        setSelectedTipoSolicitud={setSelectedTipoSolicitud}
                        tipoSolicitudOptions={tipoSolicitudOptions}
                    />
                </div>
            </div>
        </div>
    );
};

FiltrosGeneradorDecretos.propTypes = {
    fechaDesde: PropTypes.string.isRequired,
    setFechaDesde: PropTypes.func.isRequired,
    fechaHasta: PropTypes.string.isRequired,
    setFechaHasta: PropTypes.func.isRequired,
    handleCargarAprobaciones: PropTypes.func.isRequired,
    handleLimpiarFiltros: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedTipoContrato: PropTypes.array.isRequired,
    handleTipoContratoChange: PropTypes.func.isRequired,
    tipoContratoOptions: PropTypes.array.isRequired,
    selectedTipoSolicitud: PropTypes.string.isRequired,
    setSelectedTipoSolicitud: PropTypes.func.isRequired,
    tipoSolicitudOptions: PropTypes.array.isRequired,
};

export default FiltrosGeneradorDecretos;
