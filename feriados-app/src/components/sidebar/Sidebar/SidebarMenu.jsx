import NavItem from './NavItem';
import SubmenuItem from './SubmenuItem';

const SidebarMenu = ({
    cantidadNoLeidas,
    esJefe,
    isMobile,
    usuarioPermisos,
    openSubmenus,
    closeSidebar,
    toggleSubmenu
}) => (
    <div className="sidebar-content">
        <ul className="nav-list">
            <NavItem to="/home" icon="bi-house" label="Inicio" onClick={closeSidebar} />

            {usuarioPermisos.some(p => p.nombre === 'CALENDARIO AUSENCIAS') && (
                <NavItem to="/calendario" icon="bi-calendar3" label="Calendario de Ausencias" onClick={closeSidebar} />
            )}

            <NavItem to="/mis-solicitudes" icon="bi-file-earmark-text" label="Mis Solicitudes" onClick={closeSidebar} />
            <NavItem to="/solicitudes" icon="bi-file-earmark-plus" label="Nueva Solicitud" onClick={closeSidebar} />

            {usuarioPermisos.some(p => p.nombre === 'SOLICITUD POR TERCEROS') && (
                <NavItem to="/solicitudes-terceros" icon="bi-person-plus" label="Solicitud por terceros" onClick={closeSidebar} />
            )}

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

            {!isMobile && usuarioPermisos.some(p => p.nombre === 'RRHH') && (
                <SubmenuItem 
                    label="RRHH" 
                    icon="bi-people" 
                    menuId="rrhh"
                paths={['/rrhh', '/administracion/adm-solicitudes']}
                    openSubmenus={openSubmenus}
                    toggleSubmenu={toggleSubmenu}
                >
                    <NavItem to="/rrhh" icon="bi-file-earmark-text" label="Generador Decretos" onClick={closeSidebar} />
                    <NavItem to="/rrhh/subrogancia" icon="bi-person-plus" label="Ingreso Subrogancia" onClick={closeSidebar} />
                <NavItem to="/administracion/adm-solicitudes" icon="bi-pen" label="Visor de Solicitudes" onClick={closeSidebar} />
                </SubmenuItem>
            )}

            {!isMobile && usuarioPermisos.some(p => p.nombre === 'PARAMETROS') && (
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

            {!isMobile && usuarioPermisos.some(p => p.nombre === 'ADMINISTRACION') && (
                <SubmenuItem 
                    label="Administración" 
                    icon="bi-person-rolodex" 
                    menuId="administracion"
                paths={['/administracion/usuarios', '/administracion/modulos']}
                    openSubmenus={openSubmenus}
                    toggleSubmenu={toggleSubmenu}
                >
                    <NavItem to="/administracion/usuarios" icon="bi-person" label="Usuarios" onClick={closeSidebar} />
                    <NavItem to="/administracion/modulos" icon="bi-grid" label="Módulos" onClick={closeSidebar} />
                </SubmenuItem>
            )}
        </ul>
    </div>
);

export default SidebarMenu;
