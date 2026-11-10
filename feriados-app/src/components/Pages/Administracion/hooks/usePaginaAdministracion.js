import { useCallback, useEffect, useState } from 'react';

export function usePaginaAdministracion(listar, mensajeError) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [revision, setRevision] = useState(0);
    const recargar = useCallback(() => setRevision(value => value + 1), []);
    const cambiarBusqueda = value => { setLoading(true); setBusqueda(value); setPage(0); };
    const cambiarSize = value => { setLoading(true); setSize(value); setPage(0); };
    const cambiarPagina = value => { setLoading(true); setPage(value); };
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError('');
        const timer = setTimeout(() => {
            listar({ page, size, busqueda: busqueda.trim() }).then(data => {
                if (!active) return;
                const metadata = data.page ?? data;
                const totalRegistros = Number(metadata.totalElements);
                const paginas = Number(metadata.totalPages);
                if (!Number.isFinite(totalRegistros) || totalRegistros < 0 || !Number.isFinite(paginas) || paginas < 0) {
                    throw new Error('La respuesta no contiene totales de paginación válidos.');
                }
                if (page > 0 && page >= paginas) {
                    setPage(Math.max(0, paginas - 1));
                    return;
                }
                setItems(data.content);
                setTotalElements(totalRegistros);
                setTotalPages(paginas);
            }).catch(() => {
                if (active) setError(mensajeError);
            }).finally(() => {
                if (active) setLoading(false);
            });
        }, 300);
        return () => { active = false; clearTimeout(timer); };
    }, [listar, mensajeError, page, size, busqueda, revision]);
    return { items, loading, error, recargar, busqueda, setBusqueda: cambiarBusqueda, page, setPage: cambiarPagina, size, setSize: cambiarSize, totalElements, totalPages };
}
