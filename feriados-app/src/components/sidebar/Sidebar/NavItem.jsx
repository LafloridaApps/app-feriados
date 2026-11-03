import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, icon, label, badge, onClick }) => {
    const { pathname: rutaActual } = useLocation();
    return (
        <li className="nav-item">
            <Link 
                className={`nav-link-custom ${rutaActual === to ? 'active' : ''}`} 
                to={to} 
                onClick={onClick}
            >
                <i className={`bi ${icon}`}></i>
                <span>{label}</span>
                {badge > 0 && <span className="badge bg-danger rounded-pill ms-auto">{badge}</span>}
            </Link>
        </li>
    );
};

NavItem.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    badge: PropTypes.number,
    onClick: PropTypes.func
};

export default NavItem;
