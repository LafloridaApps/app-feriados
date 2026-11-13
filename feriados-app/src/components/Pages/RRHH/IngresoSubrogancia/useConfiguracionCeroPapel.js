import { useState, useCallback, useContext, useEffect } from 'react';
import { UsuarioContext } from '../../../../context/UsuarioContext';
import {
    obtenerConfiguracionCeroPapel,
    obtenerEstadoCeroPapel,
    revelarClaveCeroPapel,
    obtenerValoresInicialesCeroPapel,
    guardarConfiguracionCeroPapel,
} from '../../../../services/ceroPapelConfiguracionService';

const mensajeError = (error) => {
    if (!error.response) {
        return 'No hay conexión con el backend. Compruebe que esté iniciado con el .env actualizado y pulse Actualizar.';
    }
    if (error.response.status === 404) {
        return 'El backend no tiene disponible el módulo de configuración. Reinícielo con la versión actualizada.';
    }
    if (error.response.status === 503) {
        return 'La configuración de Cero Papel no se inicializó. Revise el arranque del backend y su .env.';
    }
    if (error.response.status >= 500) {
        return 'El backend falló al cargar la configuración de Cero Papel. Revise el error en su consola.';
    }
    if (error.response?.status === 403) return 'Se requiere el módulo CONFIGURACION CERO PAPEL para cambiar esta configuración.';
    if (error.response?.status === 409) return 'Otra persona cambió la configuración. Pulse Actualizar antes de guardar.';
    return error.response?.data?.message || 'No se pudo cargar o guardar la configuración de Cero Papel.';
};

export const useConfiguracionCeroPapel = () => {
    const funcionario = useContext(UsuarioContext);
    const rutGestor = funcionario?.rut;
    const [habilitada, setHabilitada] = useState(null);
    const [configuracion, setConfiguracion] = useState(null);
    const [valoresIniciales, setValoresIniciales] = useState(null);
    const [url, setUrl] = useState('');
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');

    useEffect(() => {
        let vigente = true;
        obtenerEstadoCeroPapel()
            .then(data => { if (vigente) setHabilitada(data.habilitada); })
            .catch(() => { if (vigente) setHabilitada(null); });
        return () => { vigente = false; };
    }, []);

    const aplicarConfiguracion = useCallback((data) => {
        setConfiguracion(data);
        setHabilitada(data.habilitada);
        setUrl(data.url);
        setUsuario(data.usuario);
        setClave('');
    }, []);

    const actualizar = useCallback(async () => {
        setOcupado(true);
        setError('');
        setAviso('');
        try {
            const iniciales = await obtenerValoresInicialesCeroPapel().catch(() => null);
            setValoresIniciales(iniciales);
            if (iniciales) {
                setUrl(iniciales.url);
                setUsuario(iniciales.usuario);
            }
            aplicarConfiguracion(await obtenerConfiguracionCeroPapel(rutGestor));
        } catch (error_) {
            setConfiguracion(null);
            setClave('');
            setError(mensajeError(error_));
        } finally {
            setOcupado(false);
        }
    }, [aplicarConfiguracion, rutGestor]);

    const guardar = async (datos) => {
        setOcupado(true);
        setError('');
        setAviso('');
        try {
            const data = await guardarConfiguracionCeroPapel(datos, rutGestor);
            aplicarConfiguracion(data);
            setAviso('Configuración guardada. El cambio se aplica a nuevas llamadas sin reiniciar.');
        } catch (error_) {
            setError(mensajeError(error_));
        } finally {
            setClave('');
            setOcupado(false);
        }
    };

    const revelarClave = async () => {
        setOcupado(true);
        setError('');
        try {
            const data = await revelarClaveCeroPapel(rutGestor);
            setClave(data.clave);
            return true;
        } catch (error_) {
            setError(mensajeError(error_));
            return false;
        } finally {
            setOcupado(false);
        }
    };

    const guardarParametros = async (evento) => {
        evento.preventDefault();
        if (!configuracion) return;
        await guardar({ habilitada: configuracion.habilitada, url, usuario, clave, version: configuracion.version });
    };

    const alternarActivacion = async () => {
        if (!configuracion) return;
        await guardar({
            habilitada: !configuracion.habilitada,
            url: configuracion.url,
            usuario: configuracion.usuario,
            clave: '',
            version: configuracion.version,
        });
    };

    return {
        habilitada, configuracion, valoresIniciales, url, setUrl, usuario, setUsuario, clave, setClave,
        ocupado, error, aviso, actualizar, guardarParametros, alternarActivacion, revelarClave,
    };
};
