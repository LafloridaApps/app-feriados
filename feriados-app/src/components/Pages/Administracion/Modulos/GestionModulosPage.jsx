import PaginacionAdministracion from '../components/PaginacionAdministracion';
import AdministracionLayout from '../components/AdministracionLayout';
import EstadoListado from '../components/EstadoListado';
import FormularioModulo from './components/FormularioModulo';
import { useGestionModulos } from './useGestionModulos';
import './GestionModulosPage.css';

export default function GestionModulosPage() {
    const gestion = useGestionModulos();
    return <AdministracionLayout titulo="Módulos" descripcion="Organice los módulos disponibles para los permisos de acceso.">
        <div className="row g-4">
            <div className="col-lg-4"><FormularioModulo nombre={gestion.nombre} setNombre={gestion.setNombre} saving={gestion.saving} disabled={gestion.loading || Boolean(gestion.error)} onSubmit={gestion.agregar} error={gestion.errorGuardar} mensaje={gestion.mensaje} /></div>
            <div className="col-lg-8"><div className="admin-panel">
                <div className="admin-toolbar"><h2 className="h5 mb-0">Catálogo de módulos <span className="badge text-bg-light">{gestion.totalElements}</span></h2></div>
                <label htmlFor="buscar-modulo" className="form-label">Buscar módulo</label>
                <input id="buscar-modulo" type="search" className="form-control mb-3" value={gestion.busqueda} onChange={event => gestion.setBusqueda(event.target.value)} />
                <EstadoListado loading={gestion.loading} error={gestion.error} onRetry={gestion.recargar} />
                {!gestion.loading && !gestion.error && <div className="table-responsive"><table className="table table-hover">
                    <caption className="visually-hidden">Módulos disponibles</caption>
                    <thead><tr><th scope="col">ID</th><th scope="col">Nombre</th></tr></thead>
                    <tbody>{gestion.filtrados.map(modulo => <tr key={modulo.id}><td>{modulo.id}</td><td className="fw-semibold">{modulo.nombre}</td></tr>)}</tbody>
                </table>{gestion.filtrados.length === 0 && <p className="admin-empty mb-0">No hay módulos para mostrar.</p>}</div>}
                <PaginacionAdministracion {...gestion} />
            </div></div>
        </div>
    </AdministracionLayout>;
}
