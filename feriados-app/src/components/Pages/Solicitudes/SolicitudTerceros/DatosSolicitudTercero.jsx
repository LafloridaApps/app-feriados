import { useSolicitudes } from '../../../../hooks/useSolicitudes';
import FormularioSolicitud from '../FormularioSolicitud';
import ResumenPermisos from '../ResumenPermisos';

export default function DatosSolicitudTercero() {
    const { funcionario, cargando, resumenAdministrativo, resumenFeriados,
        detalleAdministrativo, detalleFeriados, erroresSaldos, saldosCargados, recargarSaldos } = useSolicitudes();
    const habilitado = Boolean(funcionario) && saldosCargados && !cargando;

    return (
        <>
            {funcionario && cargando && <output className="alert alert-info d-block">Cargando saldos del solicitante...</output>}
            {erroresSaldos.length > 0 && (
                <div role="alert" className="alert alert-warning">
                    {erroresSaldos.map(mensaje => <p key={mensaje} className="mb-2">{mensaje}</p>)}
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={recargarSaldos}>Reintentar consulta de saldos</button>
                </div>
            )}
            <div className="solicitudes-section-card mb-4" aria-busy={cargando}>
                {funcionario && <p className="mb-3">Saldos de <strong>{funcionario.nombreCompleto || funcionario.nombre}</strong> · RUT: {funcionario.rut}{funcionario.vrut ? `-${funcionario.vrut}` : ''}</p>}
                <ResumenPermisos resumenAdministrativo={resumenAdministrativo} resumenFeriados={resumenFeriados} />
            </div>
            <fieldset disabled={!habilitado} className="border-0 p-0 m-0" aria-label="Datos de la solicitud">
                <FormularioSolicitud resumenAdministrativo={resumenAdministrativo} resumenFeriados={resumenFeriados}
                    detalleAdministrativo={detalleAdministrativo} detalleFeriados={detalleFeriados} />
            </fieldset>
        </>
    );
}

