import { useState } from 'react';
import PropTypes from 'prop-types';
import { getFuncionarioByRutAndVrut } from '../../../../../services/funcionarioService';
import { validarRut } from '../../../../../services/utils';
import AdministracionModal from '../../components/AdministracionModal';

export default function AddUserModal({ onClose, onUserAdded }) {
    const [rut, setRut] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');
    const buscar = async event => {
        event.preventDefault();
        if (loading || saving) return;
        setResultado(null);
        setError('');
        const limpio = rut.trim().toUpperCase();
        if (!/^\d{7,8}[\dK]$/.test(limpio)) { setError('Ingrese el RUT con dígito verificador, sin puntos ni guion. Ejemplo: 123456785.'); return; }
        if (!validarRut(limpio)) { setError('El dígito verificador del RUT es incorrecto.'); return; }
        setLoading(true);
        try {
            const funcionario = await getFuncionarioByRutAndVrut(limpio.slice(0, -1));
            if (!funcionario?.rut || String(funcionario.vrut).trim().toUpperCase() !== limpio.slice(-1)) throw new Error('No encontrado');
            setResultado(funcionario);
        } catch { setError('No se encontró el funcionario. Revise el RUT e intente nuevamente.'); }
        finally { setLoading(false); }
    };
    const agregar = async () => {
        if (!resultado || saving) return;
        setSaving(true);
        setError('');
        try { await onUserAdded(resultado); onClose(); }
        catch (error_) { setError(error_.response ? 'No se pudo guardar el usuario. Intente nuevamente.' : error_.message); }
        finally { setSaving(false); }
    };
    return <AdministracionModal titulo="Agregar usuario" onClose={onClose} busy={loading || saving}>
        <div className="modal-body"><p className="text-secondary small">Busque un funcionario para registrarlo. Después podrá asignarle módulos.</p>
            <form onSubmit={buscar}><label htmlFor="rut-usuario" className="form-label">RUT con dígito verificador</label>
                <input id="rut-usuario" className="form-control mb-2" type="text" maxLength={9} aria-describedby="ayuda-rut-usuario" placeholder="Ejemplo: 123456785" value={rut} disabled={loading || saving} onChange={event => { setRut(event.target.value); setResultado(null); setError(''); }} required />
                <p id="ayuda-rut-usuario" className="small text-secondary">Sin puntos ni guion. Incluya el dígito verificador; también puede ser K.</p>
                <button className="btn btn-outline-primary" type="submit" disabled={loading || saving}>{loading ? 'Buscando…' : 'Buscar funcionario'}</button>
            </form>
            {error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}
            {resultado && <output className="border rounded p-3 mt-3 d-block"><strong>{resultado.nombreCompleto || [resultado.nombre, resultado.apellidoPaterno, resultado.apellidoMaterno].filter(Boolean).join(' ')}</strong><span className="text-secondary d-block">{resultado.rut}-{resultado.vrut}</span></output>}
        </div>
        <div className="modal-footer"><button type="button" className="btn btn-light" onClick={onClose} disabled={loading || saving}>Cancelar</button><button type="button" className="btn btn-primary" disabled={!resultado || loading || saving} onClick={agregar}>{saving ? 'Guardando…' : 'Agregar usuario'}</button></div>
    </AdministracionModal>;
}
AddUserModal.propTypes = { onClose: PropTypes.func.isRequired, onUserAdded: PropTypes.func.isRequired };
