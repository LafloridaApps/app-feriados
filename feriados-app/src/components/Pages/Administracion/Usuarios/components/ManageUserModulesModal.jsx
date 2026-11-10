import { useState } from 'react';
import PropTypes from 'prop-types';
import { listarModulos } from '../../../../../services/moduloService';
import { guardarUsuario } from '../../../../../services/usuarioService';
import { useListadoAdministracion } from '../../hooks/useListadoAdministracion';
import AdministracionModal from '../../components/AdministracionModal';
import EstadoListado from '../../components/EstadoListado';

export default function ManageUserModulesModal({ user, onClose, onSave }) {
    const listado = useListadoAdministracion(listarModulos, 'No se pudieron cargar los módulos.');
    const [seleccionados, setSeleccionados] = useState(() => (user.modulos ?? []).map(modulo => modulo.id));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const cambiar = id => setSeleccionados(prev => prev.includes(id) ? prev.filter(value => value !== id) : [...prev, id]);
    const guardar = async () => {
        if (saving || listado.loading || listado.error) return;
        setSaving(true);
        setError('');
        try {
            await guardarUsuario({ rut: String(user.rut), modulos: [...seleccionados].sort((a, b) => a - b) });
            onSave();
            onClose();
        } catch { setError('No se pudieron guardar los permisos. Intente nuevamente.'); }
        finally { setSaving(false); }
    };
    return <AdministracionModal titulo="Gestionar módulos" onClose={onClose} busy={saving}>
        <div className="modal-body"><p className="fw-semibold mb-1">{user.nombre || user.rut}</p><p className="small text-secondary">Seleccione los módulos a los que tendrá acceso. Sin selección, el usuario quedará sin módulos asignados.</p>
            <EstadoListado loading={listado.loading} error={listado.error} onRetry={listado.recargar} />
            {!listado.loading && !listado.error && <fieldset disabled={saving}><legend className="visually-hidden">Módulos disponibles</legend>
                {listado.items.map(modulo => <div className="form-check admin-module-option" key={modulo.id}><input className="form-check-input" type="checkbox" id={`permiso-${modulo.id}`} checked={seleccionados.includes(modulo.id)} onChange={() => cambiar(modulo.id)} /><label className="form-check-label" htmlFor={`permiso-${modulo.id}`}>{modulo.nombre}</label></div>)}
                {listado.items.length === 0 && <p className="text-secondary">No hay módulos disponibles.</p>}
            </fieldset>}
            {error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}
        </div>
        <div className="modal-footer"><button type="button" className="btn btn-light" disabled={saving} onClick={onClose}>Cancelar</button><button type="button" className="btn btn-primary" disabled={saving || listado.loading || Boolean(listado.error)} onClick={guardar}>{saving ? 'Guardando…' : 'Guardar permisos'}</button></div>
    </AdministracionModal>;
}
ManageUserModulesModal.propTypes = { user: PropTypes.shape({ rut: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, nombre: PropTypes.string, modulos: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired })) }).isRequired, onClose: PropTypes.func.isRequired, onSave: PropTypes.func.isRequired };
