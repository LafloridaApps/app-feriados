import React from 'react';
import PropTypes from 'prop-types';

const DetallesAusencia = ({ fechaSeleccionada, detallesFechaSeleccionada, manejarClicEmpleado }) => {
    return (
        <div className="card-footer dashboard-details-footer">
            <h5>Detalles para {fechaSeleccionada}:</h5>
            {Object.keys(detallesFechaSeleccionada).length > 0 ? (
                Object.entries(detallesFechaSeleccionada).map(([nombreGrupo, empleados]) => (
                    <div key={nombreGrupo} className="mb-3">
                        <h6>{nombreGrupo} ({empleados.length} personas)</h6>
                        <div className="list-group">
                            {empleados.map((persona) => (
                                <button
                                    type="button"
                                    key={persona.rut}
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-start"
                                    onClick={() => manejarClicEmpleado(persona)}
                                >
                                    <div>
                                        <strong>{persona.nombre}</strong> ({persona.rut})
                                    </div>
                                    <span className="badge bg-info text-dark">{persona.motivo}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No hay ausencias para este día.</p>
            )}
        </div>
    );
};

DetallesAusencia.propTypes = {
    fechaSeleccionada: PropTypes.string,
    detallesFechaSeleccionada: PropTypes.object,
    manejarClicEmpleado: PropTypes.func
};

export default DetallesAusencia;
