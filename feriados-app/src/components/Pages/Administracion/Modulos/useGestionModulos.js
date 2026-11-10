import { useState } from 'react';
import { crearModulo, listarModulosPagina } from '../../../../services/moduloService';
import { usePaginaAdministracion } from '../hooks/usePaginaAdministracion';

export function useGestionModulos() {
    const listado = usePaginaAdministracion(listarModulosPagina, 'No se pudieron cargar los módulos.');
    const [nombre, setNombre] = useState('');
    const [saving, setSaving] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [errorGuardar, setErrorGuardar] = useState('');
    const agregar = async event => {
        event.preventDefault();
        if (saving) return;
        const limpio = nombre.trim();
        setMensaje('');
        setErrorGuardar('');
        if (!limpio) { setErrorGuardar('Ingrese el nombre del módulo.'); return; }
        setSaving(true);
        try {
            await crearModulo({ nombre: limpio });
            listado.recargar();
            setNombre('');
            setMensaje('Módulo creado correctamente.');
        } catch {
            setErrorGuardar('No se pudo crear el módulo. Revise el nombre e intente nuevamente.');
        } finally { setSaving(false); }
    };
    return { ...listado, nombre, setNombre, saving, mensaje, errorGuardar, agregar, filtrados: listado.items };
}
