import { useContext, useEffect, useState } from 'react';
import NavbarBrand from './NavbarBrand';
import NavbarNav from './NavbarNav';
import { UsuarioContext } from '../../context/UsuarioContext';
import { useIsJefe } from '../../hooks/useIsJefe';
import { useSolicitudesNoLeidas } from '../../hooks/useSolicitudesNoLeidas';

const Navbar = () => {
    const { cantidadNoLeidas } = useSolicitudesNoLeidas();
    const funcionario = useContext(UsuarioContext);
    const { codDepto, rut } = funcionario || {};
    const { esJefe } = useIsJefe(codDepto, rut);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

    useEffect(() => {
        if (window.bootstrap && window.bootstrap.Dropdown) {
            const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
            dropdownElements.forEach(dropdownEl => {
                new window.bootstrap.Dropdown(dropdownEl);
            });
        }
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
            <div className="container-fluid">
                <NavbarBrand />
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleNavCollapse}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarContent">
                    <NavbarNav
                        esJefe={esJefe}
                        cantidadNoLeidas={cantidadNoLeidas}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


