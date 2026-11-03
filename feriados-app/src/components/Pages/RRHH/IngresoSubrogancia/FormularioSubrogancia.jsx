import { FaSearch, FaUserTie, FaUserPlus, FaCalendarAlt } from 'react-icons/fa';
const FormularioSubrogancia = ({
    editingSubroganciaId,
    editingSubroganciaData,
    jefe,
    subrogante,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    isSaving,
    handleSubmit,
    handleDelete,
    cancelEdit,
    getSubmitButtonText,
    handleOpenBusquedaModal
}) => (
    <form onSubmit={handleSubmit}>
        {/* En modo edición: mostrar info de solo lectura */}
        {editingSubroganciaId && editingSubroganciaData ? (
            <div className="row g-4 mb-3">
                <div className="col-md-6 border-end form-group-custom">
                    <h5 className="section-title"><FaUserTie /> Datos del Jefe</h5>
                    <div className="mb-2">
                        <span className="custom-label-text">Nombre</span>
                        <div className="readonly-field">{editingSubroganciaData.nombreJefe}</div>
                    </div>
                    <div className="mb-2">
                        <span className="custom-label-text">Departamento</span>
                        <div className="readonly-field">{editingSubroganciaData.departamento}</div>
                    </div>
                </div>
                <div className="col-md-6 form-group-custom">
                    <h5 className="section-title"><FaUserPlus /> Datos del Subrogante</h5>
                    <div className="mb-2">
                        <span className="custom-label-text">Nombre</span>
                        <div className="readonly-field">{editingSubroganciaData.subrogante}</div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="row g-4">
                <div className="col-md-6 border-end form-group-custom">
                    <h5 className="section-title"><FaUserTie /> Datos del Jefe</h5>
                    <div className="mb-3">
                        <label htmlFor="rutJefeInput">RUT del Jefe</label>
                        <div className="input-group input-group-custom">
                            <input id="rutJefeInput" type="text" className="form-control input-custom" value={jefe.rut} onChange={jefe.handleRutChange} placeholder="Sin puntos y con guión" />
                            <button className="btn btn-outline-primary btn-search" type="button" onClick={jefe.handleBuscar}>Buscar RUT</button>
                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleOpenBusquedaModal('createJefe')} title="Buscar por nombre">
                                <FaSearch className="me-1" /> Buscar Nombre
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <span className="custom-label-text">Nombre</span>
                        <div className="readonly-field">{jefe.nombre || 'Esperando búsqueda...'}</div>
                    </div>
                    <div className="mb-3">
                        <span className="custom-label-text">Departamento</span>
                        <div className="readonly-field">{jefe.departamento || 'Esperando búsqueda...'}</div>
                    </div>
                </div>

                <div className="col-md-6 form-group-custom">
                    <h5 className="section-title"><FaUserPlus /> Datos del Subrogante</h5>
                    <div className="mb-3">
                        <label htmlFor="rutSubroganteInput">RUT del Subrogante</label>
                        <div className="input-group input-group-custom">
                            <input id="rutSubroganteInput" type="text" className="form-control input-custom" value={subrogante.rut} onChange={subrogante.handleRutChange} placeholder="Sin puntos y con guión" />
                            <button className="btn btn-outline-primary btn-search" type="button" onClick={subrogante.handleBuscar}>Buscar RUT</button>
                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleOpenBusquedaModal('createSub')} title="Buscar por nombre">
                                <FaSearch className="me-1" /> Buscar Nombre
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <span className="custom-label-text">Nombre</span>
                        <div className="readonly-field">{subrogante.nombre || 'Esperando búsqueda...'}</div>
                    </div>
                    <div className="mb-3">
                        <span className="custom-label-text">Departamento</span>
                        <div className="readonly-field">{subrogante.departamento || 'Esperando búsqueda...'}</div>
                    </div>
                </div>
            </div>
        )}

        <hr className="my-4" />

        <div className="row form-group-custom">
            <div className="col-12">
                <h5 className="section-title"><FaCalendarAlt /> Período de Subrogancia</h5>
            </div>
            <div className="col-md-6 mb-3">
                <label htmlFor="fechaInicioInput">Fecha de Inicio</label>
                <input id="fechaInicioInput" type="date" className="form-control input-custom" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
                <label htmlFor="fechaFinInput">Fecha de Fin</label>
                <input id="fechaFinInput" type="date" className="form-control input-custom" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
        </div>

        <div className="d-flex justify-content-between align-items-center gap-2 mt-4">
            <div>
                {editingSubroganciaId && (
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(editingSubroganciaData && { ...editingSubroganciaData, id: editingSubroganciaId })}
                    >
                        <i className="bi bi-trash me-1"></i>Eliminar Subrogancia
                    </button>
                )}
            </div>
            <div className="d-flex gap-2">
                {editingSubroganciaId && (
                    <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>
                        Cancelar Edición
                    </button>
                )}
                <button type="submit" className="btn btn-custom-primary text-white" disabled={isSaving}>
                    {getSubmitButtonText()}
                </button>
            </div>
        </div>
    </form>
);

export default FormularioSubrogancia;
