import PropTypes from 'prop-types';
import { formatFecha } from '../../../services/utils';

const DetalleSolicitud = ({ fechaInicio, fechaFin, tipo, diasUsar, saldo }) => {
    return (
        <div className="detalle-solicitud-container">
            <div className="card-header-premium">
                <i className="bi bi-info-circle-fill"></i>
                <span>Vista Previa de la Solicitud</span>
            </div>
            
            <div className="bg-light rounded-3 p-4 border border-dashed">
                <div className="row g-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                            <span className="text-muted small uppercase fw-bold">Tipo de Solicitud</span>
                            <span className="fw-bold text-primary">{tipo || 'No seleccionado'}</span>
                        </div>
                    </div>
                    
                    <div className="col-md-6 text-center border-end">
                        <div className="text-muted small mb-1">Fecha Inicio</div>
                        <div className="fw-bold fs-5">{formatFecha(fechaInicio)}</div>
                    </div>
                    
                    <div className="col-md-6 text-center">
                        <div className="text-muted small mb-1">Fecha Final</div>
                        <div className="fw-bold fs-5">{formatFecha(fechaFin)}</div>
                    </div>

                    <div className="col-12 mt-4 pt-4 border-top">
                        <div className="d-flex justify-content-around">
                            <div className="text-center">
                                <div className="text-muted small mb-1">Días a solicitar</div>
                                <div className="badge-premium badge-premium-primary fs-6">
                                    {diasUsar ?? '-'} días
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-muted small mb-1">Saldo proyectado</div>
                                <div className="badge-premium fs-6">
                                    {saldo} días
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded border small text-muted">
                <i className="bi bi-shield-lock me-2"></i>Esta es una vista previa de cómo se procesará tu solicitud una vez enviada.
            </div>
        </div>
    );
};

export default DetalleSolicitud;

DetalleSolicitud.propTypes = {
    fechaInicio: PropTypes.string.isRequired,
    fechaFin: PropTypes.string.isRequired,
    tipo: PropTypes.string.isRequired,
    diasUsar: PropTypes.number,
    saldo: PropTypes.number.isRequired
};