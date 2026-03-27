import { useState, useEffect, useContext } from 'react';
import { getInfoFirma } from '../services/firmaDigitalService';
import { UsuarioContext } from '../context/UsuarioContext';

export const useFirmaDigital = () => {
    const [firma, setFirma] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [tieneFirma, setTieneFirma] = useState(false);
    const funcionario = useContext(UsuarioContext);

    useEffect(() => {
        if (!funcionario?.rut) {
            setCargando(false);
            return;
        }

        const obtenerInfoFirma = async () => {
            try {
                const data = await getInfoFirma(funcionario.rut);
                if (data) {
                    setTieneFirma(true);
                    const hoy = new Date();
                    const fechaExpiracion = new Date(data.fechaExpiracion);

                    let estado = 'Vigente';
                    let mensaje = `Su firma está vigente y expira en ${data.diasRestantes} días.`;
                    let claseEstado = 'status-ok';

                    if (fechaExpiracion < hoy) {
                        estado = 'Vencida';
                        mensaje = 'Su firma digital ha expirado. Por favor, renuévela.';
                        claseEstado = 'status-danger';
                    } else if (data.diasRestantes <= 60) {
                        estado = 'Próxima a vencer';
                        mensaje = `Su firma está por vencer. Expira en ${data.diasRestantes} días.`;
                        claseEstado = 'status-warning';
                    }

                    setFirma({
                        ...data,
                        fechaVencimiento: fechaExpiracion.toLocaleDateString('es-CL'),
                        estado,
                        mensaje,
                        claseEstado
                    });
                }
            } catch (err) {
                setError(err);
            } finally {
                setCargando(false);
            }
        };

        obtenerInfoFirma();
    }, [funcionario]);

    return { firma, cargando, error, tieneFirma };
};
