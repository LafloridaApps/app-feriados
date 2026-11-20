import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../../../../hooks/useUsuario';
import { getSolicitudesByRut } from '../../../../services/misSolicitudesService';
import { formatFecha } from '../../../../services/utils';
import { getEtapaActual, getStatusBadge } from '../../MisSolicitudes/estadoSolicitud';
import '../../MisSolicitudes/MisSolicitudes.css';
import './UltimasSolicitudesWidget.css';

const UltimasSolicitudesWidget = () => {
    const rut = useUsuario()?.rut;
    const [resultado, setResultado] = useState(null);

    useEffect(() => {
        if (!rut) return;

        let vigente = true;
        const cargar = async () => {
            try {
                const { solicitudes } = await getSolicitudesByRut(rut, 0, 1);
                if (vigente) setResultado({ rut, solicitudes: solicitudes ?? [] });
            } catch {
                if (vigente) setResultado({ rut, error: true });
            }
        };

        void cargar();
        return () => { vigente = false; };
    }, [rut]);

    const actual = resultado?.rut === rut ? resultado : null;
    const cargando = Boolean(rut && !actual);
    const solicitudes = actual?.solicitudes ?? [];

    return (
        <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card ultimas-solicitudes-card h-100 d-flex flex-column">
                <div className="solicitudes-header">
                    <div className="solicitudes-icon-wrapper">
                        <i className="bi bi-calendar-check" aria-hidden="true"></i>
                    </div>
                    <h5 className="solicitudes-title">Última solicitud</h5>
                </div>

                <div className="solicitudes-list-premium" aria-busy={cargando}>
                    {cargando && <output className="text-muted small">Cargando solicitudes…</output>}
                    {actual?.error && <p className="text-muted small mb-0">No se pudieron cargar tus solicitudes.</p>}
                    {!cargando && !actual?.error && solicitudes.length === 0 && (
                        <p className="text-muted small mb-0">Aún no tienes solicitudes.</p>
                    )}
                    {solicitudes.map((solicitud) => {
                        const { id, tipoSolicitud, estadoSolicitud, fechaSolicitud, trazabilidad } = solicitud;
                        const etapa = getEtapaActual(solicitud);
                        const glosa = trazabilidad?.findLast(evento => evento.glosa?.trim())?.glosa;

                        return (
                            <div key={id} className="solicitud-item-premium">
                                <div className="solicitud-info">
                                    <span className="solicitud-type">{tipoSolicitud || 'Solicitud'}</span>
                                    <span className="solicitud-date">
                                        Folio #{id}{fechaSolicitud && ` · ${formatFecha(fechaSolicitud.split('T')[0])}`}
                                    </span>
                                </div>
                                <span className={getStatusBadge(estadoSolicitud)}>
                                    {estadoSolicitud || 'No especificado'}
                                </span>
                                {etapa && <div className="small text-muted">{etapa}</div>}
                                {glosa && <div className="small text-muted"><strong>Motivo</strong> {glosa}</div>}
                            </div>
                        );
                    })}
                </div>

                <Link to="/mis-solicitudes" className="ver-todas-btn">Ver todas</Link>
            </div>
        </div>
    );
};

export default UltimasSolicitudesWidget;
