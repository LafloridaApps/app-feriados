import { useCallback, useContext, useEffect, useState } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { SolicitudTerceroContext } from '../../../context/SolicitudTerceroContext';
import { getPermisosByUsuario } from '../../../services/usuarioService';
import { getFotoFuncionario } from '../../../services/fotoService';
import { obtenerSolicitanteDireccion, buscarSolicitantesDireccion } from '../../../services/solicitudTercerosService';
import ModalBuscarPorNombre from '../../Common/ModalBuscarPorNombre';
import FormularioSolicitud from './FormularioSolicitud';
import ResumenPermisos from './ResumenPermisos';
import { useSolicitudes } from '../../../hooks/useSolicitudes';
import './PaginaSolicitudes.css';

function DatosSolicitudTercero() {
    const { funcionario, cargando, resumenAdministrativo, resumenFeriados,
        detalleAdministrativo, detalleFeriados } = useSolicitudes();
    const habilitado = Boolean(funcionario && resumenAdministrativo && resumenFeriados) && !cargando;

    return (
        <>
            {funcionario && cargando && <p role="status" className="alert alert-info">Cargando saldos del solicitante...</p>}
            {funcionario && !cargando && !habilitado && (
                <p role="alert" className="alert alert-warning">No se obtuvieron los saldos del solicitante. Vuelve a buscar el RUT para intentar cargar sus datos.</p>
            )}
            <div className="solicitudes-section-card mb-4">
                <ResumenPermisos resumenAdministrativo={resumenAdministrativo} resumenFeriados={resumenFeriados} />
            </div>
            <fieldset disabled={!habilitado} className="border-0 p-0 m-0" aria-label="Datos de la solicitud">
                <FormularioSolicitud resumenAdministrativo={resumenAdministrativo} resumenFeriados={resumenFeriados}
                    detalleAdministrativo={detalleAdministrativo} detalleFeriados={detalleFeriados} />
            </fieldset>
        </>
    );
}

export default function SolicitudTerceros() {
    const gestor = useContext(UsuarioContext);
    const [acceso, setAcceso] = useState(null);
    const [rut, setRut] = useState('');
    const [solicitante, setSolicitante] = useState(null);
    const [buscando, setBuscando] = useState(false);
    const [error, setError] = useState('');
    const [foto, setFoto] = useState(null);
    const [mostrarBusquedaNombre, setMostrarBusquedaNombre] = useState(false);
    const limpiarPantalla = useCallback(() => {
        setRut('');
        setSolicitante(null);
        setFoto(null);
        setError('');
        setMostrarBusquedaNombre(false);
    }, []);
    const rutSolicitante = solicitante?.rut;
    const fotoVisible = foto && foto.rut === rutSolicitante ? foto.src : null;

    useEffect(() => {
        let vigente = true;
        if (rutSolicitante) {
            getFotoFuncionario(rutSolicitante).then(data => {
                if (!vigente || typeof data !== 'string' || !data.trim()) return;
                const imagen = data.trim();
                setFoto({ rut: rutSolicitante, src: imagen.startsWith('data:image/') ? imagen : `data:image/jpeg;base64,${imagen}` });
            }).catch(() => { if (vigente) setFoto(null); });
        }
        return () => { vigente = false; };
    }, [rutSolicitante]);

    useEffect(() => {
        let vigente = true;
        setAcceso(null);
        if (gestor?.rut) {
            getPermisosByUsuario(gestor.rut)
                .then(usuario => { if (vigente) setAcceso(usuario?.modulos?.some(m => m.nombre === 'SOLICITUD POR TERCEROS') ?? false); })
                .catch(() => { if (vigente) setAcceso(false); });
        }
        return () => { vigente = false; };
    }, [gestor?.rut]);

    const cargarSolicitante = async (rutIngresado) => {
        setSolicitante(null);
        setFoto(null);
        setError('');
        const limpio = String(rutIngresado ?? '').replaceAll('.', '').trim().toUpperCase();
        const match = /^(\d{1,8})(?:-([\dK]))?$/.exec(limpio);
        if (!match || Number(match[1]) <= 0) {
            setError('Ingresa un RUT válido, con o sin dígito verificador.');
            return;
        }
        if (match[2]) {
            let suma = 0, factor = 2;
            for (const digito of [...match[1]].reverse()) {
                suma += Number(digito) * factor;
                factor = factor === 7 ? 2 : factor + 1;
            }
            const valor = 11 - suma % 11;
            const dv = valor === 11 ? '0' : valor === 10 ? 'K' : String(valor);
            if (dv !== match[2]) { setError('El dígito verificador del RUT es incorrecto.'); return; }
        }
        setBuscando(true);
        try {
            const persona = await obtenerSolicitanteDireccion(gestor.rut, Number(match[1]));
            if (!persona?.rut || Number(persona.rut) !== Number(match[1]) || !persona.nombre?.trim()) {
                setError('No se encontraron datos para el RUT ingresado. Verifica el RUT del solicitante.');
                return;
            }
            setSolicitante(persona);
        } catch (errorConsulta) {
            setError(errorConsulta.response?.data?.message || (errorConsulta.response?.status === 404 || errorConsulta.response?.status === 204
                ? 'No se encontraron datos para el RUT ingresado. Verifica el RUT del solicitante.'
                : 'No fue posible consultar los datos del solicitante. Intenta nuevamente en unos momentos.'));
        } finally {
            setBuscando(false);
        }
    };

    const buscar = (event) => {
        event.preventDefault();
        void cargarSolicitante(rut);
    };

    const buscarPorNombreEnDireccion = useCallback((pattern, pageNumber) =>
        buscarSolicitantesDireccion(gestor?.rut, pattern, pageNumber), [gestor?.rut]);

    const seleccionarSolicitante = (persona) => {
        const cuerpoRut = String(persona?.rut ?? '');
        const verificador = String(persona?.vrut ?? '').trim().toUpperCase();
        const rutSeleccionado = verificador ? `${cuerpoRut}-${verificador}` : cuerpoRut;
        setRut(rutSeleccionado);
        setMostrarBusquedaNombre(false);
        void cargarSolicitante(rutSeleccionado);
    };

    if (acceso === null) return <p role="status">Cargando permisos...</p>;
    if (!acceso) return <p role="alert" className="alert alert-warning">No tienes permiso para realizar solicitudes por terceros.</p>;

    return (
        <div className="container-fluid py-4 solicitudes-page-container">
            <div className="bg-white p-4 rounded shadow-sm border-start border-4 border-primary mb-4">
                <h2 className="mb-1 text-primary fw-bold"><i className="bi bi-person-plus me-2" />Solicitud por terceros</h2>
                <p className="text-muted mb-0">Ingresa el RUT o busca por nombre. Solo puedes seleccionar funcionarios de tu dirección.</p>
            </div>
            <p className="text-muted">Ingresada por: <strong>{gestor.nombreCompleto || gestor.nombre}</strong> · RUT: {gestor.rut}{gestor.vrut ? `-${gestor.vrut}` : ''}</p>
            <section className="solicitudes-section-card mb-4" aria-labelledby="datos-solicitante">
                <h3 id="datos-solicitante" className="h5 mb-3"><i className="bi bi-person-vcard me-2" />Datos del solicitante</h3>
                <form onSubmit={buscar} className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label htmlFor="rut-solicitante" className="form-label">RUT del solicitante</label>
                        <input id="rut-solicitante" className="form-control" value={rut} required disabled={buscando}
                            aria-invalid={Boolean(error)} aria-describedby={error ? 'error-solicitante' : undefined}
                            onChange={e => { setRut(e.target.value); setSolicitante(null); setFoto(null); setError(''); }} placeholder="12345678-5" />
                    </div>
                    <div className="col-md-auto">
                        <button className="btn btn-primary" disabled={buscando}>{buscando ? 'Buscando...' : 'Buscar solicitante'}</button>
                    </div>
                    <div className="col-md-auto">
                        <button type="button" className="btn btn-outline-primary" disabled={buscando}
                            onClick={() => setMostrarBusquedaNombre(true)}>
                            <i className="bi bi-person-search me-2" />Buscar por nombre
                        </button>
                    </div>
                </form>
                {error && <p id="error-solicitante" role="alert" className="alert alert-warning mt-3 mb-0">{error}</p>}
                <div className="d-flex flex-column flex-md-row gap-4 align-items-start mt-4">
                    <div className="text-center flex-shrink-0">
                        <div className="rounded-circle border bg-light overflow-hidden d-flex align-items-center justify-content-center"
                            style={{ width: 112, height: 112 }}>
                            {fotoVisible ? (
                                <img src={fotoVisible} alt={`Foto de ${solicitante?.nombreCompleto || solicitante?.nombre || 'solicitante'}`}
                                    className="w-100 h-100" style={{ objectFit: 'cover' }} onError={() => setFoto(null)} />
                            ) : (
                                <i className="bi bi-person text-secondary" style={{ fontSize: '3rem' }} aria-hidden="true" />
                            )}
                        </div>
                        <span className="small text-muted d-block mt-2">{solicitante ? (fotoVisible ? 'Solicitante' : 'Sin foto disponible') : 'Foto del solicitante'}</span>
                    </div>
                    <div className="row g-3 flex-grow-1 w-100">
                    {[
                        ['nombre-solicitante', 'Nombre completo', solicitante?.nombreCompleto || solicitante?.nombre],
                        ['departamento-solicitante', 'Departamento', solicitante?.departamento],
                        ['correo-solicitante', 'Correo electrónico', solicitante?.email],
                    ].map(([id, label, value]) => (
                        <div className="col-md-6" key={id}>
                            <label htmlFor={id} className="form-label">{label}</label>
                            <input id={id} className="form-control" readOnly disabled={!solicitante}
                                value={value || ''} placeholder="Pendiente de consultar RUT" />
                        </div>
                    ))}
                    </div>
                </div>
            </section>
            {!solicitante && !error && <p className="text-muted small" role="status">Los saldos y el formulario se habilitarán al encontrar al solicitante.</p>}
            {mostrarBusquedaNombre && (
                <ModalBuscarPorNombre show={mostrarBusquedaNombre}
                    onClose={() => setMostrarBusquedaNombre(false)} onSelected={seleccionarSolicitante}
                    buscarFuncionarios={buscarPorNombreEnDireccion} />
            )}
            <SolicitudTerceroContext.Provider value={{ rutGestor: gestor.rut, onSolicitudCreada: limpiarPantalla }}>
                <UsuarioContext.Provider value={solicitante}>
                    <DatosSolicitudTercero key={solicitante?.rut || 'sin-solicitante'} />
                </UsuarioContext.Provider>
            </SolicitudTerceroContext.Provider>
        </div>
    );
}
