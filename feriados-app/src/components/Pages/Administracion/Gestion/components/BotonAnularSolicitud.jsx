import PropTypes from 'prop-types';

const BotonAnularSolicitud = ({ solicitud, loading, handleAnular }) => {
    const renderButtonContent = () => {
        if (loading) {
            return <><output className="spinner-border spinner-border-sm me-2" aria-hidden="true"></output>Procesando...</>;
        }
        if (solicitud.estadoSolicitud === 'ANULADA') {
            return <><i className="bi bi-ban me-2"></i>Solicitud Anulada</>;
        }
        return <><i className="bi bi-x-circle-fill me-2"></i>Anular Solicitud</>;
    };

    const mostrarBotonAnular = solicitud && solicitud.estadoSolicitud !== 'ANULADA' && !solicitud.estadoSolicitud.includes('PENDIENTE');

    if (!mostrarBotonAnular) return null;

    return (
        <div className="d-flex justify-content-center border-top pt-3 mt-auto">
            <button 
                className="btn btn-outline-danger px-4 rounded-pill fw-bold shadow-sm w-100"
                onClick={handleAnular}
                disabled={loading}
            >
                {renderButtonContent()}
            </button>
        </div>
    );
};

BotonAnularSolicitud.propTypes = {
    solicitud: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    handleAnular: PropTypes.func.isRequired,
};

export default BotonAnularSolicitud;
