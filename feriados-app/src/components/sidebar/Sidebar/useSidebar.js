import { useState, useContext, useEffect } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { useEsJefe } from '../../../hooks/useEsJefe';
import { useSolicitudesNoLeidas } from '../../../hooks/useSolicitudesNoLeidas';
import { getPermisosByUsuario } from '../../../services/usuarioService';

export const useSidebar = () => {
    const { cantidadNoLeidas } = useSolicitudesNoLeidas();
    const funcionario = useContext(UsuarioContext);
    const { codDepto, rut } = funcionario || {};
    const { esJefe } = useEsJefe(codDepto, rut);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [usuarioPermisos, setUsuarioPermisos] = useState([]);
    const [openSubmenus, setOpenSubmenus] = useState({
        infoAusencias: false,
        rrhh: false,
        parametros: false,
        administracion: false
    });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        void getPermisos();
    }, [funcionario]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const toggleSubmenu = (menu) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    return {
        cantidadNoLeidas,
        esJefe,
        isSidebarOpen,
        isMobile,
        usuarioPermisos,
        openSubmenus,
        toggleSidebar,
        closeSidebar,
        toggleSubmenu
    };
};
