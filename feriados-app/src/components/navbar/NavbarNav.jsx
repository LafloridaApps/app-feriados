import PropTypes from "prop-types";
import { useLocation } from 'react-router-dom';

const NavbarNav = ({ esJefe, cantidadNoLeidas }) => {
    const { pathname } = useLocation();

    const getLinkClass = (path) => {
        const isActive = pathname === path;
        const activeClass = 'active fw-bold text-primary border-bottom border-primary border-2';
        const normalClass = 'text-dark'; // Clase para texto oscuro en estado normal

        return `nav-link ${isActive ? activeClass : normalClass}`;
    };

    return (
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <a className={getLinkClass('/')} href="/">Inicio</a>
            </li>
            <li className="nav-item">
                <a className={getLinkClass('/mis-solicitudes')} href="/mis-solicitudes">Mis Solicitudes</a>
            </li>
            <li className="nav-item">
                <a className={getLinkClass('/solicitudes')} href="/solicitudes">Nueva Solicitud</a>
            </li>
            <li className="nav-item dropdown">
                <button
                    className="nav-link dropdown-toggle btn btn-link text-dark"
                    id="rrhhDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Información Ausencias
                </button>
                <ul className="dropdown-menu" aria-labelledby="rrhhDropdown">
                    <li><a className={`dropdown-item ${pathname === '/feriados' ? 'active' : ''}`} href="/feriados">Feriados Legales</a></li>
                    <li><a className={`dropdown-item ${pathname === '/administrativos' ? 'active' : ''}`} href="/administrativos">Administrativos</a></li>
                </ul>
            </li>
            {esJefe && (
                <li className="nav-item">
                    <a className={`${getLinkClass('/inbox')} d-flex align-items-center justify-content-between`} href="/inbox">
                        Bandeja de Solicitudes
                        {cantidadNoLeidas > 0 && (
                            <span className="badge bg-danger rounded-pill ms-2">
                                {cantidadNoLeidas}
                            </span>
                        )}
                    </a>
                </li>
            )}
            <li className="nav-item dropdown">
                <button
                    className="nav-link dropdown-toggle btn btn-link text-dark"
                    id="paramDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Parametros
                </button>
                <ul className="dropdown-menu" aria-labelledby="rrhhDropdown">
                    <li><a className={`dropdown-item ${pathname === '/deptos' ? 'active' : ''}`} href="/deptos">Departamentos</a></li>
                </ul>
            </li>
        </ul>
    )
}

export default NavbarNav;

NavbarNav.propTypes = {
    esJefe: PropTypes.bool.isRequired,
    cantidadNoLeidas: PropTypes.number.isRequired,
};