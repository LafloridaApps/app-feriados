import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UsuarioContext } from '../../../../context/UsuarioContext';
import { getPermisosByUsuario } from '../../../../services/usuarioService';
import { getFotoFuncionario } from '../../../../services/fotoService';
import { obtenerSolicitanteDireccion, buscarSolicitantesDireccion } from '../../../../services/solicitudTercerosService';
import { validarRut, mensajeErrorConsulta } from './solicitudTercerosUtils';

export function useSolicitudTerceros() {
    const gestor = useContext(UsuarioContext);
    const rutGestor = gestor?.rut;
    const [acceso, setAcceso] = useState(null);
    const [rut, setRut] = useState('');
    const [solicitante, setSolicitante] = useState(null);
    const [buscando, setBuscando] = useState(false);
    const [error, setError] = useState('');
    const [foto, setFoto] = useState(null);
    const [mostrarBusquedaNombre, setMostrarBusquedaNombre] = useState(false);
    const limpiarPantalla = useCallback(() => {
        setRut('');
        setSolicitante(null);
        setFoto(null);
        setError('');
        setMostrarBusquedaNombre(false);
    }, []);
    const valorSolicitudTercero = useMemo(
        () => ({ rutGestor, onSolicitudCreada: limpiarPantalla }),
        [rutGestor, limpiarPantalla]
    );
    const rutSolicitante = solicitante?.rut;
    const fotoVisible = foto && foto.rut === rutSolicitante ? foto.src : null;

    useEffect(() => {
        let vigente = true;
        if (rutSolicitante) {
            getFotoFuncionario(rutSolicitante).then(data => {
                if (!vigente || typeof data !== 'string' || !data.trim()) return;
                const imagen = data.trim();
                setFoto({ rut: rutSolicitante, src: imagen.startsWith('data:image/') ? imagen : `data:image/jpeg;base64,${imagen}` });
            }).catch(() => { if (vigente) setFoto(null); });
        }
        return () => { vigente = false; };
    }, [rutSolicitante]);

    useEffect(() => {
        let vigente = true;
        setAcceso(null);
        if (gestor?.rut) {
            getPermisosByUsuario(gestor.rut)
                .then(usuario => { if (vigente) setAcceso(usuario?.modulos?.some(m => m.nombre === 'SOLICITUD POR TERCEROS') ?? false); })
                .catch(() => { if (vigente) setAcceso(false); });
        }
        return () => { vigente = false; };
    }, [gestor?.rut]);

    const cargarSolicitante = async (rutIngresado) => {
        setSolicitante(null);
        setFoto(null);
        setError('');
        const { cuerpo, error: errorRut } = validarRut(rutIngresado);
        if (errorRut) {
            setError(errorRut);
            return;
        }
        setBuscando(true);
        try {
            const persona = await obtenerSolicitanteDireccion(gestor.rut, cuerpo);
            if (!persona?.rut || Number(persona.rut) !== cuerpo || !persona.nombre?.trim()) {
                setError('No se encontraron datos para el RUT ingresado. Verifica el RUT del solicitante.');
                return;
            }
            setSolicitante(persona);
        } catch (error_) {
            setError(mensajeErrorConsulta(error_));
        } finally {
            setBuscando(false);
        }
    };

    const cambiarRut = (valor) => {
        setRut(valor);
        setSolicitante(null);
        setFoto(null);
        setError('');
    };

    const buscar = (event) => {
        event.preventDefault();
        void cargarSolicitante(rut);
    };

    const buscarPorNombreEnDireccion = useCallback((pattern, pageNumber) =>
        buscarSolicitantesDireccion(gestor?.rut, pattern, pageNumber), [gestor?.rut]);

    const seleccionarSolicitante = (persona) => {
        const cuerpoRut = String(persona?.rut ?? '');
        const verificador = String(persona?.vrut ?? '').trim().toUpperCase();
        const rutSeleccionado = verificador ? `${cuerpoRut}-${verificador}` : cuerpoRut;
        setRut(rutSeleccionado);
        setMostrarBusquedaNombre(false);
        void cargarSolicitante(rutSeleccionado);
    };

    return {
        gestor, acceso, rut, solicitante, buscando, error, fotoVisible,
        mostrarBusquedaNombre, setMostrarBusquedaNombre, valorSolicitudTercero,
        cambiarRut, buscar, buscarPorNombreEnDireccion, seleccionarSolicitante,
        ocultarFoto: () => setFoto(null),
    };
}
