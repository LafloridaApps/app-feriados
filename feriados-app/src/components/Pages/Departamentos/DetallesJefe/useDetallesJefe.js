import { useEdicionJefe } from './useEdicionJefe';
import { useEdicionCodigoExterno } from './useEdicionCodigoExterno';
import { useEdicionNombreDepto } from './useEdicionNombreDepto';
import { useEliminacionDepto } from './useEliminacionDepto';

export const useDetallesJefe = ({ departamento, fetchDepartamentos, setDepartamentoSeleccionado }) => {
    const opciones = { departamento, fetchDepartamentos, setDepartamentoSeleccionado };
    const jefe = useEdicionJefe(opciones);
    const codigoExterno = useEdicionCodigoExterno(opciones);
    const nombre = useEdicionNombreDepto(opciones);
    const eliminacion = useEliminacionDepto(opciones);

    return {
        ...jefe,
        ...codigoExterno,
        ...nombre,
        ...eliminacion,
    };
};
