import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { consultarPermisoAsociacion, updateCodigoExterno } from '../../../services/departamentosService';

const aplanar = nodes => nodes.flatMap(node => [node, ...aplanar(node.dependencias || [])]);

export default function AsociacionDepartamento({ departamentos, actualizar }) {
    const [params] = useSearchParams();
    const [codigoEditado, setCodigo] = useState(null);
    const codigo = codigoEditado ?? params.get('codigoEx') ?? '';
    const [id, setId] = useState('');
    const [permitido, setPermitido] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        let activo = true;
        consultarPermisoAsociacion().then(data => { if (activo) setPermitido(data.permitido); })
            .catch(() => { if (activo) setPermitido(false); });
        return () => { activo = false; };
    }, []);
    if (!permitido) return null;
    const opciones = aplanar(departamentos);
    const seleccionado = opciones.find(d => String(d.id) === id);
    const guardar = async event => {
        event.preventDefault();
        if (!seleccionado || !/^[0-9]{1,10}$/.test(codigo)) return;
        const confirmacion = await Swal.fire({ title: 'Confirmar asociación',
            text: `Asociar el código ${codigo} al departamento ${seleccionado.nombre}.`,
            icon: 'question', showCancelButton: true, confirmButtonText: 'Guardar asociación', cancelButtonText: 'Cancelar' });
        if (!confirmacion.isConfirmed) return;
        setGuardando(true); setError(''); setMensaje('');
        try {
            await updateCodigoExterno(seleccionado.id, codigo);
            setMensaje('Asociación guardada. Se está validando nuevamente el funcionario.');
            window.dispatchEvent(new Event('validar-departamento'));
            await actualizar();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.mensaje || 'No se pudo guardar la asociación. Reintenta.');
        } finally { setGuardando(false); }
    };
    return <section className="card p-4 mb-4">
        <h3 className="h5">Asociar código externo</h3>
        <p>Selecciona el departamento interno que corresponde al código de origen. {params.get('nombreExterno') && <>Origen: <strong>{params.get('nombreExterno')}</strong>.</>}</p>
        <form onSubmit={guardar} className="row g-3">
            <div className="col-md-3"><label htmlFor="asociacion-codigo" className="form-label">Código externo</label>
                <input id="asociacion-codigo" className="form-control" value={codigo} onChange={e => setCodigo(e.target.value)} required pattern="[0-9]{1,10}" maxLength={10} disabled={guardando} /></div>
            <div className="col-md-6"><label htmlFor="asociacion-departamento" className="form-label">Departamento interno</label>
                <select id="asociacion-departamento" className="form-select" value={id} onChange={e => setId(e.target.value)} required disabled={guardando}>
                    <option value="">Selecciona un departamento</option>
                    {opciones.map(d => <option key={d.id} value={d.id}>{d.nombre} (ID {d.id}){d.codigoExterno ? ` — código ${d.codigoExterno}` : ''}</option>)}
                </select></div>
            <div className="col-md-3 d-flex align-items-end"><button className="btn btn-primary" disabled={guardando || !seleccionado}>{guardando ? 'Guardando…' : 'Guardar asociación'}</button></div>
        </form>
        {mensaje && <p role="status" className="text-success mt-3 mb-0">{mensaje}</p>}
        {error && <p role="alert" className="text-danger mt-3 mb-0">{error}</p>}
    </section>;
}
AsociacionDepartamento.propTypes = { departamentos: PropTypes.array.isRequired, actualizar: PropTypes.func.isRequired };
