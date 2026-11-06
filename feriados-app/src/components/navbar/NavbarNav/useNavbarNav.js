import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavbarNav = (closeMobileMenu) => {
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



    return { rutaActual, openDropdown, dropdownRef, toggleDropdown, handleLinkClick };
};
