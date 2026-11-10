import { useRef, useState } from 'react';
import { buscarFuncionariosPorNombre } from '../../../../../services/funcionarioService';
import { getSolicitudesVisorPorRut } from '../../../../../services/solicitudService';
import { formatFecha } from '../../../../../services/utils';

const SearchSolicitud = ({ onSelect, onReset, detailLoading }) => {
    const [modo, setModo] = useState('id');
    const [texto, setTexto] = useState('');
    const [resultado, setResultado] = useState(null);
    const [persona, setPersona] = useState(null);
    const [pagina, setPagina] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const version = useRef(0);
    const consulta = useRef('');
    const cambiarModo = valor => {
        version.current++;
        setModo(valor); setTexto(''); setResultado(null); setPersona(null);
        setError(''); setPagina(0); setLoading(false); onReset();
    };
    const consultar = async (page = 0, funcionario = null) => {
        const turno = ++version.current;
        setLoading(true); setError(''); setResultado(null); setPagina(page); onReset();
        try {
            if (modo === 'nombre' && !funcionario) {
                setPersona(null);
                const data = await buscarFuncionariosPorNombre(consulta.current, page);
                if (turno === version.current) setResultado({ ...data, tipo: 'personas' });
            } else {
                const rut = funcionario?.rut || consulta.current.replaceAll('.', '').split('-')[0].trim();
                const data = await getSolicitudesVisorPorRut(rut, page);
                if (turno === version.current) {
                    setPersona(funcionario);
                    setResultado({ ...data, tipo: 'solicitudes' });
                }
            }
        } catch {
            if (turno === version.current) setError('No fue posible realizar la búsqueda. Intenta nuevamente.');
        } finally {
            if (turno === version.current) setLoading(false);
        }
    };
    const buscar = e => {
        e.preventDefault();
        const valor = texto.trim();
        if (modo === 'id') {
            if (!/^[1-9]\d*$/.test(valor)) return setError('Ingresa un número de solicitud válido.');
            setError(''); onSelect(valor); return;
        }
        if (modo === 'rut' && !/^\d{1,3}(?:\.\d{3}){2}(?:-[\dkK])?$|^\d{7,8}(?:-[\dkK])?$/.test(valor)) {
            setError('Ingresa un RUT válido, con o sin puntos y dígito verificador.'); return;
        }
        if (modo === 'nombre' && valor.length < 3) return setError('Ingresa al menos 3 caracteres del nombre o apellido.');
        consulta.current = valor;
        void consultar();
    };
    const personas = resultado?.tipo === 'personas';
    const filas = personas ? resultado.funcionarios || [] : resultado?.solicitudes || [];
    return <section className="visor-search" aria-label="Búsqueda de solicitudes">
        <div className="visor-search-heading"><div><h3>Encuentra una solicitud</h3><p>Busca directamente por número o consulta las solicitudes de un funcionario.</p></div><span className="visor-scope"><i className="bi bi-buildings" aria-hidden="true" /> Todos los departamentos</span></div>
        <div className="visor-modes" role="group" aria-label="Buscar por">
            {[['id', 'hash', 'N° de solicitud'], ['rut', 'person-vcard', 'RUT'], ['nombre', 'people', 'Nombre']].map(([valor, icono, etiqueta]) => <button type="button" key={valor} disabled={detailLoading} aria-pressed={modo === valor} className={modo === valor ? 'active' : ''} onClick={() => cambiarModo(valor)}><i className={`bi bi-${icono}`} aria-hidden="true" />{etiqueta}</button>)}
        </div>
        <form onSubmit={buscar} className="visor-search-form">
            <div><label htmlFor="visor-consulta">{modo === 'id' ? 'Número de solicitud' : modo === 'rut' ? 'RUT del funcionario' : 'Nombre o apellido'}</label>
                <input id="visor-consulta" className="form-control" value={texto} onChange={e => setTexto(e.target.value)} placeholder={modo === 'id' ? 'Ej.: 1234' : modo === 'rut' ? 'Ej.: 12345678-9' : 'Ej.: María González'} required disabled={loading || detailLoading} />
            </div><button className="btn btn-primary" disabled={loading || detailLoading}><i className="bi bi-search me-2" aria-hidden="true" />{loading || detailLoading ? 'Buscando…' : 'Buscar'}</button>
        </form>
        {modo !== 'id' && <p className="small text-muted mt-2 mb-0">La búsqueda incluye funcionarios de toda la institución, sin filtro de jerarquía.</p>}
        {error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}
        {loading && <p role="status" className="mt-3">Consultando resultados…</p>}
        {resultado && <div className="visor-results" aria-live="polite">
            <div className="d-flex flex-wrap justify-content-between gap-2 mb-3"><h4>{personas ? 'Funcionarios encontrados' : `Solicitudes${persona ? ` de ${persona.nombreCompleto}` : ''}`}</h4><span className="text-muted small">{resultado.totalItems ?? resultado.totalElements ?? filas.length} resultados</span></div>
            {!personas && modo === 'nombre' && <button className="btn btn-link px-0 mb-2" disabled={loading || detailLoading} onClick={() => consultar(0)}>Volver a funcionarios</button>}
            {filas.length === 0 ? <p className="visor-empty">{personas ? 'No se encontraron funcionarios. Prueba con otro nombre o apellido.' : 'No hay solicitudes registradas para este RUT.'}</p> : <div className="table-responsive"><table className="table align-middle table-hover"><thead><tr>{(personas ? ['RUT', 'Funcionario', 'Departamento', 'Acción'] : ['Solicitud', 'Tipo', 'Período', 'Estado', 'Acción']).map(t => <th key={t}>{t}</th>)}</tr></thead><tbody>{filas.map(f => personas ? <tr key={f.rut}><td className="text-nowrap">{f.rut}{f.vrut ? `-${f.vrut}` : ''}</td><td>{f.nombreCompleto}</td><td>{f.departamento || 'Sin información'}</td><td><button className="btn btn-outline-primary btn-sm text-nowrap" disabled={detailLoading} onClick={() => consultar(0, f)}>Ver solicitudes</button></td></tr> : <tr key={f.id}><td className="fw-semibold">#{f.id}</td><td>{f.tipoSolicitud}</td><td className="text-nowrap">{formatFecha(f.fechaInicio)} — {formatFecha(f.fechaFin)}</td><td><span className="badge bg-primary-subtle text-primary">{f.estadoSolicitud}</span></td><td><button className="btn btn-outline-primary btn-sm text-nowrap" disabled={detailLoading} onClick={() => onSelect(f.id)}>Ver detalle</button></td></tr>)}</tbody></table></div>}
            {resultado.totalPages > 1 && <nav className="d-flex justify-content-between align-items-center gap-2" aria-label="Páginas de resultados"><button className="btn btn-outline-secondary btn-sm" disabled={pagina === 0 || detailLoading} onClick={() => consultar(pagina - 1, persona)}>Anterior</button><span className="small">Página {pagina + 1} de {resultado.totalPages}</span><button className="btn btn-outline-secondary btn-sm" disabled={pagina + 1 >= resultado.totalPages || detailLoading} onClick={() => consultar(pagina + 1, persona)}>Siguiente</button></nav>}
        </div>}
    </section>;
};
export default SearchSolicitud;
