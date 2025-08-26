
import PropTypes from 'prop-types';

const WelcomeWidget = ({ funcionario }) => {
    const { nombre, departamento, foto, nombreJefe } = funcionario;
    const fotoUrl = foto ? `data:image/jpeg;base64,${foto}` : '';

    return (
        <div className="card shadow-lg rounded-4 p-4 bg-white">
            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                <img
                    src={fotoUrl}
                    alt={`Foto de ${nombre}`}
                    className="rounded-circle mb-3 mb-md-0 me-md-4"
                    width="120"
                    height="120"
                    style={{ objectFit: 'cover', border: '4px solid #007bff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                />
                <div>
                    <h2 className="font-weight-bold text-primary mb-1">¡Bienvenido, {nombre}!</h2>
                    <p className="text-muted mb-1">{departamento}</p>
                    <p className="lead text-secondary mb-0">
                        Tu jefe directo es <span className="fw-bold text-dark">{nombreJefe}</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

WelcomeWidget.propTypes = {
    funcionario: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        departamento: PropTypes.string.isRequired,
        foto: PropTypes.string,
        nombreJefe: PropTypes.string.isRequired,
    }).isRequired,
};

export default WelcomeWidget;
