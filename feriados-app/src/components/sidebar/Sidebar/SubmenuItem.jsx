import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const SubmenuItem = ({ label, icon, menuId, children, paths, openSubmenus, toggleSubmenu }) => {
    const { pathname: rutaActual } = useLocation();
    const isOpen = openSubmenus[menuId];
    const isActive = paths.some(path => rutaActual.startsWith(path));

    return (
        <li className="nav-item">
            <button 
                className={`nav-link-custom submenu-toggle ${isActive ? 'active' : ''}`}
                onClick={() => toggleSubmenu(menuId)}
                aria-expanded={isOpen}
            >
                <div className="d-flex align-items-center">
                    <i className={`bi ${icon}`}></i>
                    <span>{label}</span>
                </div>
                <i className={`bi bi-chevron-down submenu-icon ${isOpen ? 'open' : ''}`}></i>
            </button>
            <ul className={`submenu-list ${isOpen ? 'open' : ''}`}>
                {children}
            </ul>
        </li>
    );
};

SubmenuItem.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    menuId: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    paths: PropTypes.arrayOf(PropTypes.string).isRequired,
    openSubmenus: PropTypes.object.isRequired,
    toggleSubmenu: PropTypes.func.isRequired
};

export default SubmenuItem;
