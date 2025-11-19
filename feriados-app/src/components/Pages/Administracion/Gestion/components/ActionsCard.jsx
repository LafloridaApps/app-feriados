import React from 'react';

const ActionsCard = ({ solicitud, editableData, handleInputChange, handleUpdateSolicitud, handleRepairUrl, loading }) => {
    const canEdit = solicitud.estadoSolicitud === 'APROBADA';
    return (
        <div className="card-content h-100">
            <h4><i className="bi bi-pencil-square"></i> Modificar Solicitud</h4>
            <p className="text-muted">Realice cambios en las fechas o el estado. Solo se permiten cambios en solicitudes aprobadas.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label
                            htmlFor="fechaInicio"
                            className="form-label">Fecha de Inicio</label>
                        <input type="date"
                            className="form-control" id="fechaInicio"
                            name="fechaInicio" value={editableData.fechaInicio}
                            onChange={handleInputChange}
                            disabled={!canEdit || loading} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label
                            htmlFor="fechaTermino"
                            className="form-label">Fecha de Término</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fechaTermino"
                            name="fechaTermino"
                            value={editableData.fechaTermino}
                            onChange={handleInputChange}
                            disabled={!canEdit || loading} />
                    </div>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="estadoSolicitud"
                        className="form-label">Cambiar Estado</label>
                    <select
                        className="form-select"
                        id="estadoSolicitud"
                        name="estadoSolicitud"
                        value={editableData.estadoSolicitud}
                        onChange={handleInputChange}
                        disabled={!canEdit || loading}>
                        <option value="APROBADA">APROBADA</option>
                        <option value="RECHAZADA">POSTERGADA</option>
                    </select>
                </div>
                <div className="d-grid gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={handleUpdateSolicitud}
                        disabled={!canEdit || loading}>
                        <i className="bi bi-check-circle"></i> {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleRepairUrl} disabled={loading}>
                        <i className="bi bi-arrow-repeat"></i> {loading ? 'Procesando...' : 'Reparar URL (Re-firmar)'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ActionsCard;
