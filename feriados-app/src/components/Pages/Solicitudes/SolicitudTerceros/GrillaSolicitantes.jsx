import { useEffect, useState } from 'react';
import { mensajeErrorConsulta } from './solicitudTercerosUtils';

export default function GrillaSolicitantes({ buscarFuncionarios, seleccionar, seleccionando }) {
    const [texto, setTexto] = useState('');
    const [consulta, setConsulta] = useState({ nombre: '', pagina: 0 });
    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let vigente = true;
        setCargando(true);
        setError('');
        setResultado(null);
        buscarFuncionarios(consulta.nombre, consulta.pagina)
            .then(data => { if (vigente) setResultado(data); })
            .catch(err => { if (vigente) setError(mensajeErrorConsulta(err)); })
            .finally(() => { if (vigente) setCargando(false); });
        return () => { vigente = false; };
    }, [buscarFuncionarios, consulta]);

    return (
        <section className="mt-4" aria-labelledby="funcionarios-direccion" aria-busy={cargando}>
            <h4 id="funcionarios-direccion" className="h6">Funcionarios de tu dirección</h4>
            <form className="d-flex flex-wrap gap-2 mb-3" onSubmit={event => {
                event.preventDefault();
                setConsulta({ nombre: texto.trim(), pagina: 0 });
            }}>
                <label htmlFor="nombre-grilla" className="visually-hidden">Nombre o apellido</label>
                <input id="nombre-grilla" className="form-control w-auto flex-grow-1" value={texto}
                    onChange={event => setTexto(event.target.value)} placeholder="Buscar por nombre o apellido" />
                <button className="btn btn-primary" type="submit">Buscar</button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => {
                    setTexto('');
                    setConsulta({ nombre: '', pagina: 0 });
                }}>Mostrar todos</button>
            </form>
            {error && <p className="alert alert-warning" role="alert">{error}</p>}
            {cargando && <p role="status">Cargando funcionarios...</p>}
            {resultado && <>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead><tr><th scope="col">Nombre</th><th scope="col">RUT</th><th scope="col">Departamento</th><th scope="col">Acción</th></tr></thead>
                        <tbody>
                            {resultado.funcionarios?.map(persona => <tr key={persona.rut}>
                                <td>{persona.nombreCompleto}</td>
                                <td>{persona.rut}-{persona.vrut}</td>
                                <td>{persona.departamento || 'Sin información'}</td>
                                <td><button type="button" className="btn btn-sm btn-outline-primary" disabled={seleccionando}
                                    aria-label={`Seleccionar a ${persona.nombreCompleto}`} onClick={() => seleccionar(persona)}>Seleccionar</button></td>
                            </tr>)}
                            {!resultado.funcionarios?.length && <tr><td colSpan={4}>No se encontraron funcionarios en tu dirección{consulta.nombre ? ' con ese nombre o apellido' : ''}.</td></tr>}
                        </tbody>
                    </table>
                </div>
                {resultado.totalPages > 0 && <nav className="d-flex align-items-center gap-3" aria-label="Páginas de funcionarios">
                    <button type="button" className="btn btn-outline-secondary btn-sm" disabled={consulta.pagina === 0}
                        onClick={() => setConsulta(actual => ({ ...actual, pagina: actual.pagina - 1 }))}>Anterior</button>
                    <span>Página {consulta.pagina + 1} de {resultado.totalPages}</span>
                    <button type="button" className="btn btn-outline-secondary btn-sm" disabled={consulta.pagina + 1 >= resultado.totalPages}
                        onClick={() => setConsulta(actual => ({ ...actual, pagina: actual.pagina + 1 }))}>Siguiente</button>
                </nav>}
            </>}
        </section>
    );
}
