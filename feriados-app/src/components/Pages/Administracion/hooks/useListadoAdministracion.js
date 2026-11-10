import { useCallback, useEffect, useState } from 'react';

export function useListadoAdministracion(listar, mensajeError) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [revision, setRevision] = useState(0);
    const recargar = useCallback(() => setRevision(value => value + 1), []);
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError('');
        listar().then(data => {
            if (active) setItems(data ?? []);
        }).catch(() => {
            if (active) setError(mensajeError);
        }).finally(() => {
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, [listar, mensajeError, revision]);
    return { items, setItems, loading, error, recargar };
}
