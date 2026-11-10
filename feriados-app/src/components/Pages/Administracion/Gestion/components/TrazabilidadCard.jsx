import PropTypes from 'prop-types';
import React from 'react';

const TrazabilidadCard = ({ derivaciones, cantidadDias }) => {
    const unidadDias = cantidadDias === 1 ? 'día' : 'días';

    return (
        <div className="card-content h-100">
            <h4><i className="bi bi-diagram-3"></i> Trazabilidad</h4>
            <div className="d-flex align-items-center justify-content-between gap-3 bg-primary bg-opacity-10 rounded-3 p-3 mt-3">
                <span className="small fw-semibold text-primary"><i className="bi bi-calendar-range me-2" aria-hidden="true" />Días solicitados</span>
                <strong className="text-primary">{cantidadDias == null ? 'Sin información' : `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(cantidadDias)} ${unidadDias}`}</strong>
            </div>
            <div className="table-responsive mt-4">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Departamento</th>
                            <th>Estado</th>
                            <th>Recepcionado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {derivaciones && derivaciones.length > 0 ? (
                            derivaciones.map((d) => (
                                <tr key={d.id}>
                                    <td>{new Date(d.fechaDerivacion).toLocaleDateString()}</td>
                                    <td>{d.nombreDepartamento}</td>
                                    <td><span className={`badge bg-${d.estadoDerivacion === 'FINALIZADA' ? 'success' : 'warning'}`}>{d.estadoDerivacion}</span></td>
                                    <td className={d.recepcionada ? 'recepcionado-si' : 'recepcionado-no'}>{d.recepcionada ? 'Sí' : 'No'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center">No hay datos de trazabilidad.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

TrazabilidadCard.propTypes = {
    derivaciones: PropTypes.array,
    cantidadDias: PropTypes.number,
};


export default TrazabilidadCard;
