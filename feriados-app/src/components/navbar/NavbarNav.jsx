import PropTypes from 'prop-types';
import EnlaceNavbar from './NavbarNav/EnlaceNavbar';
import MenuDesplegableNavbar from './NavbarNav/MenuDesplegableNavbar';
import AccionesSesion from './NavbarNav/AccionesSesion';
import { enlacesNavbar } from './NavbarNav/enlacesNavbar';
import { useNavbarNav } from './NavbarNav/useNavbarNav';

const NavbarNav = ({ esJefe, cantidadNoLeidas, closeMobileMenu, permisos }) => {
    const { rutaActual, openDropdown, dropdownRef, toggleDropdown, handleLinkClick } = useNavbarNav(closeMobileMenu);
    const enlacesVisibles = enlacesNavbar.filter(enlace =>
        (!enlace.soloJefe || esJefe) &&
        (!enlace.permiso || permisos.some(p => p.nombre === enlace.permiso))
    );

    return (
        <>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" ref={dropdownRef}>
                {enlacesVisibles.map(enlace => enlace.enlaces ? (
                    <MenuDesplegableNavbar key={enlace.id} menu={enlace} rutaActual={rutaActual}
                        openDropdown={openDropdown} toggleDropdown={toggleDropdown} handleLinkClick={handleLinkClick} />
                ) : (
                    <EnlaceNavbar key={enlace.ruta} enlace={enlace} rutaActual={rutaActual}
                        handleLinkClick={handleLinkClick} cantidadNoLeidas={cantidadNoLeidas} />
                ))}
            </ul>
            <AccionesSesion />
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
