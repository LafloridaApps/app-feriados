import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

const NavbarNav = ({ esJefe, cantidadNoLeidas, closeMobileMenu }) => {
    const { pathname: rutaActual } = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    const handleLinkClick = () => {
        setOpenDropdown(null); // Cierra cualquier dropdown abierto
        closeMobileMenu();    // Cierra el menú de hamburguesa
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const obtenerClaseEnlace = (ruta) => {
        return `nav-link ${rutaActual === ruta ? 'active fw-bold text-primary border-bottom border-primary border-2' : 'text-dark'}`;
    };

    return (
        <ul className="navbar-nav me-auto mb-2 mb-lg-0" ref={dropdownRef}>
            <li className="nav-item">
                <Link className={obtenerClaseEnlace('/')} to="/" onClick={handleLinkClick}>Inicio</Link>
            </li>
            <li className="nav-item">
                <Link className={obtenerClaseEnlace('/dashboard')} to="/dashboard" onClick={handleLinkClick}>Dashboard</Link>
            </li>
            <li className="nav-item">
                <Link className={obtenerClaseEnlace('/mis-solicitudes')} to="/mis-solicitudes" onClick={handleLinkClick}>Mis Solicitudes</Link>
            </li>
            <li className="nav-item">
                <Link className={obtenerClaseEnlace('/solicitudes')} to="/solicitudes" onClick={handleLinkClick}>Nueva Solicitud</Link>
            </li>
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-dark" href="#" role="button" onClick={() => toggleDropdown('infoAusencias')} aria-expanded={openDropdown === 'infoAusencias'}>
                    Información Ausencias
                </a>
                <ul className={`dropdown-menu ${openDropdown === 'infoAusencias' ? 'show' : ''}`}>
                    <li><Link className={`dropdown-item ${rutaActual === '/feriados' ? 'active' : ''}`} to="/feriados" onClick={handleLinkClick}>Feriados Legales</Link></li>
                    <li><Link className={`dropdown-item ${rutaActual === '/administrativos' ? 'active' : ''}`} to="/administrativos" onClick={handleLinkClick}>Administrativos</Link></li>
                </ul>
            </li>
            {esJefe && (
                <li className="nav-item">
                    <Link className={`${obtenerClaseEnlace('/inbox')} d-flex align-items-center justify-content-between`} to="/inbox" onClick={handleLinkClick}>
                        Bandeja de Solicitudes
                        {cantidadNoLeidas > 0 && <span className="badge bg-danger rounded-pill ms-2">{cantidadNoLeidas}</span>}
                    </Link>
                </li>
            )}
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-dark" href="#" role="button" onClick={() => toggleDropdown('rrhh')} aria-expanded={openDropdown === 'rrhh'}>
                    RRHH
                </a>
                <ul className={`dropdown-menu ${openDropdown === 'rrhh' ? 'show' : ''}`}>
                    <li><Link className={`dropdown-item ${rutaActual === '/rrhh' ? 'active' : ''}`} to="/rrhh" onClick={handleLinkClick}>Generador Decretos</Link></li>
                    <li><Link className={`dropdown-item ${rutaActual === '/rrhh/subrogancia' ? 'active' : ''}`} to="/rrhh/subrogancia" onClick={handleLinkClick}>Ingreso Subrogancia</Link></li>
                </ul>
            </li>
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-dark" href="#" role="button" onClick={() => toggleDropdown('parametros')} aria-expanded={openDropdown === 'parametros'}>
                    Parámetros
                </a>
                <ul className={`dropdown-menu ${openDropdown === 'parametros' ? 'show' : ''}`}>
                    <li><Link className={`dropdown-item ${rutaActual === '/deptos' ? 'active' : ''}`} to="/deptos" onClick={handleLinkClick}>Departamentos</Link></li>
                    <li><Link className={`dropdown-item ${rutaActual === '/parametros/documentos' ? 'active' : ''}`} to="/parametros/documentos" onClick={handleLinkClick}>Gestión de Documentos</Link></li>
                </ul>
            </li>
        </ul>
    );
};

export default NavbarNav;

NavbarNav.propTypes = {
    esJefe: PropTypes.bool.isRequired,
    cantidadNoLeidas: PropTypes.number.isRequired,
    closeMobileMenu: PropTypes.func.isRequired,
};