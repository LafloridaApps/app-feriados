import React from 'react';

const TrazabilidadCard = ({ derivaciones }) => (
    <div className="card-content h-100">
        <h4><i className="bi bi-diagram-3"></i> Trazabilidad</h4>
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

export default TrazabilidadCard;
