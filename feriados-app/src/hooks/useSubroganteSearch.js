
import { useSubrogante } from "./useSubrogante";

export const useSubroganteSearch = (setSubrogante, setErrors) => {
    const { consultarRut } = useSubrogante();

    const handleBuscar = async (rut, fechaInicio, fechaFin) => {
        setErrors({ mensaje: '', detalle: '' });
        setSubrogante(null);

        const rutLimpio = rut.replace(/\D/g, '');

        if (!rutLimpio) {
            setErrors({ mensaje: 'RUT inválido', detalle: 'Por favor, ingrese un RUT válido sin puntos ni guiones.' });
            return;
        }

        const rutSinDv = rutLimpio.slice(0, -1);

        try {
            const dataFuncionario = await consultarRut(rutSinDv, fechaInicio,fechaFin);
            
            setSubrogante(dataFuncionario);
        } catch (error) {
            console.error('Error al consultar funcionario:', error);
            setSubrogante(null);

            if (error.response?.data) {
                setErrors({
                    mensaje: error.response.data.mensaje || 'Error desconocido',
                });
            } else if (error.message) {
                setErrors({
                    mensaje: 'Error de red o conexión',
                    detalle: error.message
                });
            } else {
                setErrors({
                    mensaje: 'Error inesperado',
                    detalle: 'Ocurrió un error al buscar el funcionario.'
                });
            }
        }
    };

    return { handleBuscar };
};
