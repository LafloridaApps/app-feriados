import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UsuarioContext } from '../../context/UsuarioContext';
import { useEsJefe } from '../../hooks/useEsJefe';
import { useSolicitudesNoLeidas } from '../../hooks/useSolicitudesNoLeidas';
import { getPermisosByUsuario } from '../../services/usuarioService';
import { LOGO_URL } from '../../assets/constants';
import './Sidebar.css';

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

const Sidebar = () => {
    const { cantidadNoLeidas } = useSolicitudesNoLeidas();
    const funcionario = useContext(UsuarioContext);
    const { codDepto, rut } = funcionario || {};
    const { esJefe } = useEsJefe(codDepto, rut);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [usuarioPermisos, setUsuarioPermisos] = useState([]);
    const [openSubmenus, setOpenSubmenus] = useState({
        infoAusencias: false,
        rrhh: false,
        parametros: false,
        administracion: false
    });

    useEffect(() => {
        const getPermisos = async () => {
            if (funcionario?.rut) {
                try {
                    const response = await getPermisosByUsuario(funcionario.rut);
                    if (response) {
                        setUsuarioPermisos(response.modulos);
                    }
                } catch (error) {
                    console.error("Error al obtener permisos:", error);
                }
            }
        };
        getPermisos();
    }, [funcionario]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const toggleSubmenu = (menu) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    return (
        <>
            <button className="mobile-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                <i className={`bi ${isSidebarOpen ? 'bi-x' : 'bi-list'}`}></i>
            </button>

            {isSidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar} aria-hidden="true"></div>}

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" onClick={closeSidebar}>
                        <img src={LOGO_URL} alt="Logo FeriadosApp" width="120" height="48" />
                    </Link>
                </div>

                <div className="sidebar-content">
                    <ul className="nav-list">
                        <NavItem to="/home" icon="bi-house" label="Inicio" onClick={closeSidebar} />
                        
                        {usuarioPermisos.some(p => p.nombre === 'DASHBOARD') && (
                            <NavItem to="/dashboard" icon="bi-speedometer2" label="Dashboard" onClick={closeSidebar} />
                        )}

                        <NavItem to="/mis-solicitudes" icon="bi-file-earmark-text" label="Mis Solicitudes" onClick={closeSidebar} />
                        <NavItem to="/solicitudes" icon="bi-file-earmark-plus" label="Nueva Solicitud" onClick={closeSidebar} />

                        <SubmenuItem 
                            label="Información Ausencias" 
                            icon="bi-info-circle" 
                            menuId="infoAusencias"
                            paths={['/feriados', '/administrativos']}
                            openSubmenus={openSubmenus}
                            toggleSubmenu={toggleSubmenu}
                        >
                            <NavItem to="/feriados" icon="bi-calendar-check" label="Feriados Legales" onClick={closeSidebar} />
                            <NavItem to="/administrativos" icon="bi-briefcase" label="Administrativos" onClick={closeSidebar} />
                        </SubmenuItem>

                        {esJefe && (
                            <NavItem to="/inbox" icon="bi-inbox" label="Bandeja de Solicitudes" badge={cantidadNoLeidas} onClick={closeSidebar} />
                        )}

                        {usuarioPermisos.some(p => p.nombre === 'RRHH') && (
                            <SubmenuItem 
                                label="RRHH" 
                                icon="bi-people" 
                                menuId="rrhh"
                                paths={['/rrhh']}
                                openSubmenus={openSubmenus}
                                toggleSubmenu={toggleSubmenu}
                            >
                                <NavItem to="/rrhh" icon="bi-file-earmark-text" label="Generador Decretos" onClick={closeSidebar} />
                                <NavItem to="/rrhh/subrogancia" icon="bi-person-plus" label="Ingreso Subrogancia" onClick={closeSidebar} />
                            </SubmenuItem>
                        )}

                        {usuarioPermisos.some(p => p.nombre === 'PARAMETROS') && (
                            <SubmenuItem 
                                label="Parámetros" 
                                icon="bi-gear" 
                                menuId="parametros"
                                paths={['/deptos', '/parametros/documentos']}
                                openSubmenus={openSubmenus}
                                toggleSubmenu={toggleSubmenu}
                            >
                                <NavItem to="/deptos" icon="bi-diagram-3" label="Departamentos" onClick={closeSidebar} />
                                <NavItem to="/parametros/documentos" icon="bi-file-text" label="Gestión de Documentos" onClick={closeSidebar} />
                            </SubmenuItem>
                        )}

                        {usuarioPermisos.some(p => p.nombre === 'ADMINISTRACION') && (
                            <SubmenuItem 
                                label="Administración" 
                                icon="bi-person-rolodex" 
                                menuId="administracion"
                                paths={['/administracion']}
                                openSubmenus={openSubmenus}
                                toggleSubmenu={toggleSubmenu}
                            >
                                <NavItem to="/administracion/usuarios" icon="bi-person" label="Usuarios" onClick={closeSidebar} />
                                <NavItem to="/administracion/modulos" icon="bi-grid" label="Módulos" onClick={closeSidebar} />
                                <NavItem to="/administracion/adm-solicitudes" icon="bi-pen" label="Actualización" onClick={closeSidebar} />
                            </SubmenuItem>
                        )}
                    </ul>
                </div>

                <div className="sidebar-footer">
                    <a className="footer-btn" href="https://appx.laflorida.cl/login/menu.php" title="Volver al Menú Principal">
                        <i className="bi bi-arrow-left-circle"></i>
                        <span>Menú Principal</span>
                    </a>
                    <button className="footer-btn" onClick={() => {
                        sessionStorage.clear();
                        globalThis.location.href = 'https://appx.laflorida.cl/login/';
                    }} title="Cerrar Sesión">
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

import PropTypes from 'prop-types';

NavItem.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    badge: PropTypes.number,
    onClick: PropTypes.func
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

export default Sidebar;

