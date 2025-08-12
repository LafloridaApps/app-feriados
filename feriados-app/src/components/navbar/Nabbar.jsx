import { useContext, useEffect, useState } from 'react';
import NavbarBrand from './NavbarBrand';
import NavbarNav from './NavbarNav';
import { UsuarioContext } from '../../context/UsuarioContext';
import { useIsJefe } from '../../hooks/useIsJefe';
import { useSolicitudesNoLeidas } from '../../hooks/useSolicitudesNoLeidas';

const Navbar = () => {

     const { cantidadNoLeidas } = useSolicitudesNoLeidas();

    const [esJefe, setEsJefe] = useState(false);
    const { verificar } = useIsJefe();

    const funcionario = useContext(UsuarioContext);

    const { codDepto, rut } = funcionario || {};


    useEffect(() => {
        if (codDepto && rut) {
            verificar(codDepto, rut)
                .then(response => setEsJefe(response.esJefe))
                .catch(() => setEsJefe(false));
        }
    }, [codDepto, rut, funcionario, verificar]);


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
            <div className="container-fluid">
                <NavbarBrand />
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarContent">
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


