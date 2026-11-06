import { UsuarioContext } from '../../../context/UsuarioContext';
import { SolicitudTerceroContext } from '../../../context/SolicitudTerceroContext';
import ModalBuscarPorNombre from '../../Common/ModalBuscarPorNombre';
import BusquedaSolicitante from './SolicitudTerceros/BusquedaSolicitante';
import FichaSolicitante from './SolicitudTerceros/FichaSolicitante';
import DatosSolicitudTercero from './SolicitudTerceros/DatosSolicitudTercero';
import { useSolicitudTerceros } from './SolicitudTerceros/useSolicitudTerceros';
import './PaginaSolicitudes.css';

export default function SolicitudTerceros() {
    const {
        gestor, acceso, rut, solicitante, buscando, error, fotoVisible, ocultarFoto,
        mostrarBusquedaNombre, setMostrarBusquedaNombre, valorSolicitudTercero,
        cambiarRut, buscar, buscarPorNombreEnDireccion, seleccionarSolicitante,
    } = useSolicitudTerceros();

    if (acceso === null) return <output>Cargando permisos...</output>;
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
                <BusquedaSolicitante rut={rut} buscando={buscando} error={error}
                    buscar={buscar} cambiarRut={cambiarRut}
                    abrirBusquedaNombre={() => setMostrarBusquedaNombre(true)} />
                <FichaSolicitante solicitante={solicitante} fotoVisible={fotoVisible} ocultarFoto={ocultarFoto} />
            </section>
            {!solicitante && !error && <output className="text-muted small d-block">Los saldos y el formulario se habilitarán al encontrar al solicitante.</output>}
            {mostrarBusquedaNombre && (
                <ModalBuscarPorNombre show={mostrarBusquedaNombre}
                    onClose={() => setMostrarBusquedaNombre(false)} onSelected={seleccionarSolicitante}
                    buscarFuncionarios={buscarPorNombreEnDireccion} />
            )}
            <SolicitudTerceroContext.Provider value={valorSolicitudTercero}>
                <UsuarioContext.Provider value={solicitante}>
                    <DatosSolicitudTercero key={solicitante?.rut || 'sin-solicitante'} />
                </UsuarioContext.Provider>
            </SolicitudTerceroContext.Provider>
        </div>
    );
}
