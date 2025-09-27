import { useState, useContext, useEffect } from 'react';
import NavbarBrand from './NavbarBrand';
import NavbarNav from './NavbarNav';
import { UsuarioContext } from '../../context/UsuarioContext';
import { useIsJefe } from '../../hooks/useIsJefe';
import { useSolicitudesNoLeidas } from '../../hooks/useSolicitudesNoLeidas';
import { getPermisosByUsuario } from '../../services/usuarioService';

const Navbar = () => {
    const { cantidadNoLeidas } = useSolicitudesNoLeidas();
    const funcionario = useContext(UsuarioContext);
    const { codDepto, rut } = funcionario || {};
    const { esJefe } = useIsJefe(codDepto, rut);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const [usuarioPermisos, setUsuarioPermisos] = useState([]);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
    const closeMobileMenu = () => setIsNavCollapsed(true);

    useEffect(() => {


        const getPermisos = async () => {

            const response = await getPermisosByUsuario(rut)
            if (response) {
                setUsuarioPermisos(response.modulos)
            }

        }
        getPermisos()

    }, [rut])


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
            <div className="container-fluid">
                <NavbarBrand />
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleNavCollapse} // Usamos el manejador de React
                    aria-controls="navbarContent"
                    aria-expanded={!isNavCollapsed}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                {/* La clase 'show' se aplica cuando el menú no está colapsado */}
                <div className={`${isNavCollapsed ? 'collapse' : 'show'} navbar-collapse`} id="navbarContent">
                    <NavbarNav
                        esJefe={esJefe}
                        cantidadNoLeidas={cantidadNoLeidas}
                        permisos={usuarioPermisos}
                        closeMobileMenu={closeMobileMenu} // Pasamos la función para cerrar el menú
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
