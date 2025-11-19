import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

const NavbarNav = ({ esJefe, cantidadNoLeidas, closeMobileMenu, permisos }) => {
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
        return `nav-link ${rutaActual === ruta ? 'active fw-bold text-white border-bottom border-white border-2' : 'text-white'}`;
    };

    return (
        <>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" ref={dropdownRef}>
                <li className="nav-item">
                    <Link className={obtenerClaseEnlace('/home')} to="/home" onClick={handleLinkClick}><i className="bi bi-house me-2"></i>Inicio</Link>
                </li>
                {
                    permisos.some(p => p.nombre == 'DASHBOARD') && (
                        <li className="nav-item">
                            <Link className={obtenerClaseEnlace('/dashboard')} to="/dashboard" onClick={handleLinkClick}><i className="bi bi-speedometer2 me-2"></i>Dashboard</Link>
                        </li>
                    )
                }

                <li className="nav-item">
                    <Link className={obtenerClaseEnlace('/mis-solicitudes')} to="/mis-solicitudes" onClick={handleLinkClick}><i className="bi bi-file-earmark-text me-2"></i>Mis Solicitudes</Link>
                </li>
                <li className="nav-item">
                    <Link className={obtenerClaseEnlace('/solicitudes')} to="/solicitudes" onClick={handleLinkClick}><i className="bi bi-file-earmark-plus me-2"></i>Nueva Solicitud</Link>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle text-white" href="#" role="button" onClick={() => toggleDropdown('infoAusencias')} aria-expanded={openDropdown === 'infoAusencias'}>
                        <i className="bi bi-info-circle me-2"></i>Información Ausencias
                    </a>
                    <ul className={`dropdown-menu dropdown-menu-dark ${openDropdown === 'infoAusencias' ? 'show' : ''}`}>
                        <li><Link className={`dropdown-item ${rutaActual === '/feriados' ? 'active' : ''}`} to="/feriados" onClick={handleLinkClick}><i className="bi bi-calendar-check me-2"></i>Feriados Legales</Link></li>
                        <li><Link className={`dropdown-item ${rutaActual === '/administrativos' ? 'active' : ''}`} to="/administrativos" onClick={handleLinkClick}><i className="bi bi-briefcase me-2"></i>Administrativos</Link></li>
                    </ul>
                </li>
                {esJefe && (
                    <li className="nav-item">
                        <Link className={`${obtenerClaseEnlace('/inbox')} d-flex align-items-center justify-content-between`} to="/inbox" onClick={handleLinkClick}>
                            <span><i className="bi bi-inbox me-2"></i>Bandeja de Solicitudes</span>
                            {cantidadNoLeidas > 0 && <span className="badge bg-danger rounded-pill ms-2">{cantidadNoLeidas}</span>}
                        </Link>
                    </li>
                )}

                {
                    permisos.some(p => p.nombre == 'RRHH') && (
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle text-white" href="#" role="button" onClick={() => toggleDropdown('rrhh')} aria-expanded={openDropdown === 'rrhh'}>
                                <i className="bi bi-people me-2"></i>RRHH
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-dark ${openDropdown === 'rrhh' ? 'show' : ''}`}>
                                <li><Link className={`dropdown-item ${rutaActual === '/rrhh' ? 'active' : ''}`} to="/rrhh" onClick={handleLinkClick}><i className="bi bi-file-earmark-text me-2"></i>Generador Decretos</Link></li>
                                <li><Link className={`dropdown-item ${rutaActual === '/rrhh/subrogancia' ? 'active' : ''}`} to="/rrhh/subrogancia" onClick={handleLinkClick}><i className="bi bi-person-plus me-2"></i>Ingreso Subrogancia</Link></li>
                            </ul>
                        </li>

                    )

                }
                {
                    permisos.some(p => p.nombre == 'PARAMETROS') && (
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle text-white" href="#" role="button" onClick={() => toggleDropdown('parametros')} aria-expanded={openDropdown === 'parametros'}>
                                <i className="bi bi-gear me-2"></i>Parámetros
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-dark ${openDropdown === 'parametros' ? 'show' : ''}`}>
                                <li><Link className={`dropdown-item ${rutaActual === '/deptos' ? 'active' : ''}`} to="/deptos" onClick={handleLinkClick}><i className="bi bi-diagram-3 me-2"></i>Departamentos</Link></li>
                                <li><Link className={`dropdown-item ${rutaActual === '/parametros/documentos' ? 'active' : ''}`} to="/parametros/documentos" onClick={handleLinkClick}><i className="bi bi-file-text me-2"></i>Gestión de Documentos</Link></li>
                            </ul>
                        </li>

                    )

                }
                {
                    permisos.some(p => p.nombre == 'ADMINISTRACION') && (
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle text-white" href="#" role="button" onClick={() => toggleDropdown('administracion')} aria-expanded={openDropdown === 'administracion'}>
                                <i className="bi bi-person-rolodex me-2"></i>Administración
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-dark ${openDropdown === 'administracion' ? 'show' : ''}`}>
                                <li><Link
                                    className={`dropdown-item ${rutaActual === '/administracion/usuarios' ? 'active' : ''}`}
                                    to="/administracion/usuarios"
                                    onClick={handleLinkClick}><i className="bi bi-person me-2"></i>Usuarios</Link></li>
                                <li><Link
                                    className={`dropdown-item ${rutaActual === '/administracion/modulos' ? 'active' : ''}`}
                                    to="/administracion/modulos"
                                    onClick={handleLinkClick}><i className="bi bi-grid me-2"></i>Módulos</Link></li>
                                <li><Link
                                    className={`dropdown-item ${rutaActual === '/administracion/adm-solicitudes' ? 'active' : ''}`}
                                    to="/administracion/adm-solicitudes"
                                    onClick={handleLinkClick}> <i className="bi bi-pen me-2"></i> Actualizacion de Solicitudes</Link></li>
                            </ul>
                        </li>
                    )


                }
            </ul>
            <div className="d-flex align-items-center">
                <ul className="navbar-nav flex-row">
                    <li className="nav-item me-3">
                        <a className="nav-link" href="https://appx.laflorida.cl/login/menu.php" title="Volver al Menú Principal">
                            <i className="bi bi-arrow-left-circle text-white" style={{ fontSize: '1.25rem' }}></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <button className="btn nav-link" onClick={() => {
                            sessionStorage.clear();
                            window.location.href = 'https://appx.laflorida.cl/login/';
                        }} title="Cerrar Sesión">
                            <i className="bi bi-box-arrow-right text-white" style={{ fontSize: '1.25rem' }}></i>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default NavbarNav;

NavbarNav.propTypes = {
    esJefe: PropTypes.bool.isRequired,
    cantidadNoLeidas: PropTypes.number.isRequired,
    closeMobileMenu: PropTypes.func.isRequired,
    permisos: PropTypes.array,
};