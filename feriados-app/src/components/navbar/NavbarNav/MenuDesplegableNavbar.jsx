import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const MenuDesplegableNavbar = ({ menu, rutaActual, openDropdown, toggleDropdown, handleLinkClick }) => (
    <li className="nav-item dropdown">
        <button className="nav-link dropdown-toggle text-white"
            onClick={() => toggleDropdown(menu.id)} aria-expanded={openDropdown === menu.id}>
            <i className={`bi ${menu.icono} me-2`}></i>{menu.titulo}
        </button>
        <ul className={`dropdown-menu dropdown-menu-dark ${openDropdown === menu.id ? 'show' : ''}`}>
            {menu.enlaces.map(enlace => (
                <li key={enlace.ruta}>
                    <Link className={`dropdown-item ${rutaActual === enlace.ruta ? 'active' : ''}`}
                        to={enlace.ruta} onClick={handleLinkClick}>
                        <i className={`bi ${enlace.icono} me-2`}></i>{enlace.titulo}
                    </Link>
                </li>
            ))}
        </ul>
    </li>
);

MenuDesplegableNavbar.propTypes = {
    menu: PropTypes.object.isRequired,
    rutaActual: PropTypes.string.isRequired,
    openDropdown: PropTypes.string,
    toggleDropdown: PropTypes.func.isRequired,
    handleLinkClick: PropTypes.func.isRequired,
};

export default MenuDesplegableNavbar;
