import PropTypes from 'prop-types';
import { formatFecha } from '../../../services/utils';

const DetalleMiSolicitud = ({ solicitud }) => {

    

    const timelineItemStyle = {
        position: 'relative',
        paddingLeft: '30px',
        borderLeft: '2px solid #e9ecef',
        paddingBottom: '15px',
    };

    const timelineIconStyle = {
        position: 'absolute',
        left: '-11px',
        top: '0',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#0d6efd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    };

    const getIconForAction = (action) => {
        switch (action.toUpperCase()) {
            case 'CREACIÓN':
                return 'bi bi-pencil-fill';
            case 'VISACIÓN':
                return 'bi bi-check-circle-fill';
            case 'APROBACIÓN':
                return 'bi bi-patch-check-fill';
            case 'POSTERGACIÓN':
                return 'bi bi-x-circle-fill';
            default:
                return 'bi bi-info-lg';
        }
    };

    
    return (
        <div className="p-3 bg-light rounded">
            <div className="row">
                <div className="col-md-6">
                    <h6>Detalles del Permiso</h6>
                    <p className="mb-1"><strong>Desde:</strong> {formatFecha(solicitud.fechaInicio)}</p>
                    <p className="mb-1"><strong>Hasta:</strong> {formatFecha(solicitud.fechaFin)}</p>
                    <p className="mb-1"><strong>Días solicitados:</strong> {solicitud.cantidadDias}</p>
                </div>
                <div className="col-md-6">
                    <h6>Trazabilidad</h6>
                    <div style={{ position: 'relative' }}>
                        {solicitud.trazabilidad.map((evento, index) => (
                            <div key={index} style={timelineItemStyle}>
                                <div style={timelineIconStyle}>
                                    <i className={getIconForAction(evento.accion)}></i>
                                </div>
                                <div className="ms-3">
                                    <p className="fw-bold mb-0">{evento.accion}</p>
                                    <p className="text-muted small mb-0">{formatFecha(evento.fecha)} por {evento.usuario}</p>
                                    {evento.departamento && <p className="small text-muted mt-1">Departamento: {evento.departamento}</p>}
                                    {evento.estado && <p className="small text-muted mt-1">Estado: {evento.estado}</p>}
                                    {evento.estado =="POSTERGADA" && <p className='small text-muted mt-1'> Glosa : {evento.glosa}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

DetalleMiSolicitud.propTypes = {
    solicitud: PropTypes.shape({
        fechaInicio: PropTypes.string.isRequired,
        fechaFin: PropTypes.string.isRequired,
        cantidadDias: PropTypes.number.isRequired,
        trazabilidad: PropTypes.arrayOf(PropTypes.shape({
            fecha: PropTypes.string.isRequired,
            accion: PropTypes.string.isRequired,
            usuario: PropTypes.string.isRequired,
            departamento: PropTypes.string, // Cambiado de comentario a departamento
        })).isRequired,
    }).isRequired,
};

export default DetalleMiSolicitud;