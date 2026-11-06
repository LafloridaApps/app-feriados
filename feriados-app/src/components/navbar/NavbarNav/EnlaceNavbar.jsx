import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const EnlaceNavbar = ({ enlace, rutaActual, handleLinkClick, cantidadNoLeidas }) => {
    const claseActiva = rutaActual === enlace.ruta ? 'active fw-bold text-white border-bottom border-white border-2' : 'text-white';
    const contenido = <><i className={`bi ${enlace.icono} me-2`}></i>{enlace.titulo}</>;

    return (
        <li className="nav-item">
            <Link className={`nav-link ${claseActiva}${enlace.soloJefe ? ' d-flex align-items-center justify-content-between' : ''}`}
                to={enlace.ruta} onClick={handleLinkClick}>
                {enlace.soloJefe ? <span>{contenido}</span> : contenido}
                {enlace.soloJefe && cantidadNoLeidas > 0 && (
                    <span className="badge bg-danger rounded-pill ms-2">{cantidadNoLeidas}</span>
                )}
            </Link>
        </li>
    );
};

EnlaceNavbar.propTypes = {
    enlace: PropTypes.object.isRequired,
    rutaActual: PropTypes.string.isRequired,
    handleLinkClick: PropTypes.func.isRequired,
    cantidadNoLeidas: PropTypes.number.isRequired,
};

export default EnlaceNavbar;
