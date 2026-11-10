import PropTypes from 'prop-types';
export default function UserTable({ usuarios, onManageClick }) {
    return <div className="table-responsive"><table className="table table-hover">
        <caption className="visually-hidden">Usuarios y permisos de acceso</caption>
        <thead><tr><th scope="col">Usuario</th><th scope="col">RUT</th><th scope="col">Módulos asignados</th><th scope="col">Acciones</th></tr></thead>
        <tbody>{usuarios.map(usuario => <tr key={usuario.rut}>
            <td className="usuario-nombre">{usuario.nombre || 'Sin nombre'}<span className="d-block small text-secondary fw-normal">{usuario.login || 'Sin login'}</span></td>
            <td className="text-nowrap">{usuario.rut}{usuario.vrut && `-${usuario.vrut}`}</td>
            <td className="usuario-permisos">{usuario.modulos?.length ? usuario.modulos.map(modulo => <span className="admin-module-badge" key={modulo.id}>{modulo.nombre || `Módulo ${modulo.id}`}</span>) : <span className="text-secondary small">Sin módulos asignados</span>}</td>
            <td><button type="button" className="btn btn-outline-primary btn-sm text-nowrap" onClick={() => onManageClick(usuario)} aria-label={`Gestionar módulos de ${usuario.nombre || usuario.rut}`}>Gestionar módulos</button></td>
        </tr>)}</tbody>
    </table>{usuarios.length === 0 && <p className="admin-empty mb-0">No se encontraron usuarios.</p>}</div>;
}
UserTable.propTypes = { usuarios: PropTypes.arrayOf(PropTypes.shape({ rut: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, nombre: PropTypes.string, login: PropTypes.string, vrut: PropTypes.string, modulos: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired, nombre: PropTypes.string })) })).isRequired, onManageClick: PropTypes.func.isRequired };
