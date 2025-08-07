
import PropTypes from 'prop-types';

const SubroganteSearchResult = ({ subrogante, errors }) => {
    if (errors.mensaje) {
        return (
            <div className="alert alert-danger">
                {errors.mensaje} <br />
                {errors.detalle}
            </div>
        );
    }

    if (subrogante) {
        return (
            <div className="alert alert-success">
                <strong>Nombre:</strong> {subrogante.nombre} {subrogante.apellidoPaterno} {subrogante.apellidoMaterno}
            </div>
        );
    }

    return null;
};

SubroganteSearchResult.propTypes = {
    subrogante: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
    }),
    errors: PropTypes.shape({
        mensaje: PropTypes.string,
        detalle: PropTypes.string,
    }).isRequired,
};

export default SubroganteSearchResult;
