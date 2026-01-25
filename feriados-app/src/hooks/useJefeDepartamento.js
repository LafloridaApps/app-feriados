import { useState, useEffect } from 'react';
import { getFuncionarioByRutAndVrut } from '../services/funcionarioService';

const useJefeDepartamento = (departamentoSeleccionado) => {
    const [jefeSeleccionado, setJefeSeleccionado] = useState(null);
    const [isJefeLoading, setIsJefeLoading] = useState(false);

    useEffect(() => {
        const buscarJefe = async () => {
            if (departamentoSeleccionado && departamentoSeleccionado.rutJefe) {
                setIsJefeLoading(true);
                try {
                    const response = await getFuncionarioByRutAndVrut(departamentoSeleccionado.rutJefe);
                    setJefeSeleccionado(response);
                } catch (error) {
                    console.error("Error al buscar los detalles del jefe:", error);
                    setJefeSeleccionado(null);
                } finally {
                    setIsJefeLoading(false);
                }
            } else {
                setJefeSeleccionado(null);
            }
        };

        buscarJefe();
    }, [departamentoSeleccionado]);

    return { jefeSeleccionado, isJefeLoading };
};

export default useJefeDepartamento;
