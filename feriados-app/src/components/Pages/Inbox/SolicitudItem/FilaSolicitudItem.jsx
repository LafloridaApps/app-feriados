import { formatFecha } from '../../../../services/utils';
import { getStatusBadge } from '../../../../hooks/useSolicitudItem';
import AccionesSolicitudItem from './AccionesSolicitudItem';

const FilaSolicitudItem = ({
    solicitud,
    esNoLeida,
    isSubrogada,
    subroganciaText,
    acciones,
    handlerEntrada,
    handlerVisar,
    handlerAprobar,
    handlePostergar,
    handleVerAnulacion,
    open,
    handleVerDetalleClick
}) => {
    const { id, nombreFuncionario, fechaSolicitud, tipoSolicitud, estadoSolicitud, urlPdf, tieneAnulacionPendiente } = solicitud;

    return (
        <tr
            className={`d-none d-md-table-row align-middle ${esNoLeida ? 'fw-bold bg-light' : ''}`}
            style={tieneAnulacionPendiente ? {
                borderLeft: '5px solid #f97316',
                background: 'linear-gradient(90deg, #fff7ed 0%, #ffffff 40%)',
            } : { borderLeft: '5px solid transparent' }}
        >
            <td className={`ps-4 ${esNoLeida ? 'fw-bolder text-dark' : 'fw-bold text-secondary'}`}>
                <div className="d-flex align-items-center gap-2">
                    #{id}
                    {tieneAnulacionPendiente && (
                        <span
                            style={{
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                background: '#f97316',
                                display: 'inline-block',
                                animation: 'pulse-orange 1.4s infinite',
                                flexShrink: 0,
                            }}
                            title="Tiene anulación pendiente"
                        />
                    )}
                </div>
            </td>
            <td className="text-truncate" style={{ maxWidth: '250px' }}>
                <span className={`d-block text-dark ${esNoLeida ? 'fw-bolder' : 'fw-medium'}`}>{nombreFuncionario}</span>
                {isSubrogada && <small className="d-block text-info fw-bold" style={{ fontSize: '0.75rem' }}>{subroganciaText}</small>}
            </td>
            <td>
                <span className={`badge ${tipoSolicitud?.includes('FERIADO') ? 'bg-info bg-opacity-10 text-info border border-info-subtle' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle'} px-2 py-1 ${esNoLeida ? 'fw-bold' : ''}`}>
                    {tipoSolicitud}
                </span>
            </td>
            <td>
                <span className={`${esNoLeida ? 'text-dark fw-bold' : 'text-muted fw-medium'}`}><i className={`bi bi-calendar-event me-1 ${esNoLeida ? 'text-primary' : 'text-secondary opacity-50'}`}></i> {formatFecha(fechaSolicitud)}</span>
            </td>
            <td>
                <span className={getStatusBadge(estadoSolicitud)}>{estadoSolicitud}</span>
            </td>
            <td className="text-center">
                <AccionesSolicitudItem
                    acciones={acciones}
                    estadoSolicitud={estadoSolicitud}
                    tieneAnulacionPendiente={tieneAnulacionPendiente}
                    handlerEntrada={handlerEntrada}
                    handlerVisar={handlerVisar}
                    handlerAprobar={handlerAprobar}
                    handlePostergar={handlePostergar}
                    handleVerAnulacion={handleVerAnulacion}
                />
            </td>
            <td className="text-center">
                <button
                    onClick={handleVerDetalleClick}
                    className="btn btn-sm btn-light text-primary rounded-circle border shadow-sm"
                    aria-expanded={open}
                    aria-controls={`collapse-${id}`}
                    title="Detalle"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                >
                    <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </button>

            </td>
            <td className='text-center pe-4'>
                {
                    urlPdf && (<button
                        className='btn btn-sm btn-outline-danger rounded-circle shadow-sm'
                        onClick={() => window.open(urlPdf, '_blank', 'noopener,noreferrer')}
                        title="Ver Decreto PDF"
                        style={{ width: '32px', height: '32px', padding: 0 }}
                    >
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                    </button>)
                }


            </td>
        </tr>
    );
};

export default FilaSolicitudItem;
