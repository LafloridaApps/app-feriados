import { useState, useEffect } from 'react';

const useTamanoVentana = () => {
    const [tamanoVentana, setTamanoVentana] = useState({
        ancho: undefined,
        alto: undefined,
    });

    useEffect(() => {
        const manejarCambioTamano = () => {
            setTamanoVentana({
                ancho: window.innerWidth,
                alto: window.innerHeight,
            });
        };

        window.addEventListener('resize', manejarCambioTamano);

        // Call handler right away so state gets updated with initial window size
        manejarCambioTamano();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', manejarCambioTamano);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return tamanoVentana;
};

export default useTamanoVentana;
