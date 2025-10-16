import { useState, useEffect, useContext } from 'react';
import { getInfoFirma } from '../services/firmaDigitalService';
import { UsuarioContext } from '../context/UsuarioContext';

export const useFirmaDigital = () => {
    const [firma, setFirma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tieneFirma, setTieneFirma] = useState(false);
    const funcionario = useContext(UsuarioContext);

    useEffect(() => {
        if (!funcionario || !funcionario.rut) {
            setLoading(false);
            return;
        }

        const fetchFirmaInfo = async () => {
            try {
                const data = await getInfoFirma(funcionario.rut);
                if (data) {
                    setTieneFirma(true);
                    const hoy = new Date();
                    const fechaVencimiento = new Date();
                    fechaVencimiento.setDate(hoy.getDate() + data.diasRestantes);

                    let estado = 'Vigente';
                    let mensaje = `Su firma está vigente y expira en ${data.diasRestantes} días.`;
                    let statusClass = 'status-ok';

                    if (data.diasRestantes <= 0) {
                        estado = 'Vencida';
                        mensaje = 'Su firma digital ha expirado. Por favor, renuévela.';
                        statusClass = 'status-danger';
                    } else if (data.diasRestantes <= 60) {
                        estado = 'Próxima a vencer';
                        mensaje = `Su firma está por vencer. Expira en ${data.diasRestantes} días.`;
                        statusClass = 'status-warning';
                    }

                    setFirma({
                        ...data,
                        fechaVencimiento: fechaVencimiento.toLocaleDateString('es-CL'),
                        estado,
                        mensaje,
                        statusClass
                    });
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFirmaInfo();
    }, [funcionario]);

    return { firma, loading, error, tieneFirma };
};
