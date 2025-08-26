import PropTypes from "prop-types";
import { useLocation } from 'react-router-dom';

const NavbarNav = ({ esJefe, cantidadNoLeidas }) => {
    const { pathname: rutaActual } = useLocation();

    const obtenerClaseEnlace = (ruta) => {
        const estaActivo = rutaActual === ruta;
        const claseActiva = 'active fw-bold text-primary border-bottom border-primary border-2';
        const claseNormal = 'text-dark'; // Clase para texto oscuro en estado normal

        return `nav-link ${estaActivo ? claseActiva : claseNormal}`;
    };

    return (
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <a className={obtenerClaseEnlace('/')} href="/">Inicio</a>
            </li>
            <li className="nav-item">
                <a className={obtenerClaseEnlace('/dashboard')} href="/dashboard">Dashboard</a>
            </li>
            <li className="nav-item">
                <a className={obtenerClaseEnlace('/mis-solicitudes')} href="/mis-solicitudes">Mis Solicitudes</a>
            </li>
            <li className="nav-item">
                <a className={obtenerClaseEnlace('/solicitudes')} href="/solicitudes">Nueva Solicitud</a>
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
                    <li><a className={`dropdown-item ${rutaActual === '/feriados' ? 'active' : ''}`} href="/feriados">Feriados Legales</a></li>
                    <li><a className={`dropdown-item ${rutaActual === '/administrativos' ? 'active' : ''}`} href="/administrativos">Administrativos</a></li>
                </ul>
            </li>
            {esJefe && (
                <li className="nav-item">
                    <a className={`${obtenerClaseEnlace('/inbox')} d-flex align-items-center justify-content-between`} href="/inbox">
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
                    id="rrhhGenDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    RRHH
                </button>
                <ul className="dropdown-menu" aria-labelledby="rrhhGenDropdown">
                    <li><a className={`dropdown-item ${rutaActual === '/rrhh' ? 'active' : ''}`} href="/rrhh">Generador Decretos</a></li>
                </ul>
            </li>
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
                    <li><a className={`dropdown-item ${rutaActual === '/deptos' ? 'active' : ''}`} href="/deptos">Departamentos</a></li>
                    <li><a className={`dropdown-item ${rutaActual === '/parametros/documentos' ? 'active' : ''}`} href="/parametros/documentos">Gestión de Documentos</a></li>
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