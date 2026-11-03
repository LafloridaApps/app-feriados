import Swal from 'sweetalert2';
import { FaSearch } from 'react-icons/fa';

const JefaturaDepartamento = ({
    departamento,
    enEdicion,
    nombreJefeEditado,
    rutCompleto,
    setRutCompleto,
    disabled,
    fotoJefe,
    setShowBusquedaModal,
    handleEditar,
    handleGuardarJefe,
    handleBuscarJefePorRut,
    handleCancelar
}) => {
    // --- Renderizado de campos --- //
    const renderNombre = () => {
        return <>{departamento.nombreJefe || 'No disponible'}</>;
    };

    const renderRut = () => {
        if (departamento.rutJefe && departamento.vrutJefe) return <>{`${departamento.rutJefe}-${departamento.vrutJefe}`}</>;
        return <>{'No disponible'}</>;
    };

    const renderEmail = () => {
        return <>{departamento.email || 'No disponible'}</>;
    };

    const renderJefaturaContent = () => {
        if (enEdicion) {
            return (
                <div className="bg-light p-4 rounded border">
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label htmlFor="rutJefeInput" className="form-label text-muted small fw-bold text-uppercase">RUT del Funcionario</label>
                            <div className="input-group">
                                <input id="rutJefeInput" type="text" className="form-control" placeholder="Ej: 12345678-9" onChange={(e) => setRutCompleto(e.target.value)} value={rutCompleto} />
                                <button className="btn btn-outline-secondary" type="button" onClick={() => setShowBusquedaModal(true)} title="Buscar por nombre">
                                    <FaSearch className="me-1" />{' '}Buscar Nombre
                                </button>
                                <button className="btn btn-primary px-4" type="button" onClick={handleBuscarJefePorRut}>
                                    Buscar RUT
                                </button>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="nombreJefe" className="form-label text-muted small fw-bold text-uppercase">Nombre Encontrado</label>
                            <input id="nombreJefe" type="text" className="form-control bg-white" readOnly value={nombreJefeEditado} placeholder="El nombre aparecerá aquí..." />
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-4 justify-content-end">
                        <button type="button" className="btn btn-light border" onClick={handleCancelar}>Cancelar</button>
                        <button type="button" className="btn btn-success px-4" onClick={() => handleGuardarJefe()} disabled={disabled || !nombreJefeEditado}>
                            <i className="bi bi-check-circle me-2"></i>Guardar
                        </button>
                    </div>
                </div>
            );
        }

        if (departamento.rutJefe) {
            return (
                <div className="d-flex align-items-center gap-4 mt-2 p-3 bg-light rounded border border-light">
                    {fotoJefe ? (
                        <button
                            type="button"
                            className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden border-0 p-0 detalles-jefe-foto-btn"
                            onClick={() => {
                                void Swal.fire({
                                    imageUrl: fotoJefe,
                                    imageAlt: 'Foto Jefatura',
                                    showConfirmButton: false,
                                    showCloseButton: true,
                                    customClass: { image: 'img-fluid rounded' }
                                });
                            }}
                            title="Ver foto"
                        >
                            <img src={fotoJefe} alt="Foto Jefatura" className="detalles-jefe-foto-img" />
                        </button>
                    ) : (
                        <div
                            className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden detalles-jefe-foto-default"
                        >
                            <i className="bi bi-person-fill detalles-jefe-icon-large"></i>
                        </div>
                    )}
                    <div className="flex-grow-1">
                        <h5 className="mb-2 text-dark fw-semibold">{renderNombre()}</h5>
                        <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 text-muted small">
                            <span className="d-flex align-items-center gap-2">
                                <i className="bi bi-upc-scan text-primary"></i>
                                {renderRut()}
                            </span>
                            <span className="d-flex align-items-center gap-2">
                                <i className="bi bi-envelope text-primary"></i>
                                {renderEmail()}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center p-5 bg-light rounded border">
                <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 detalles-jefe-avatar-placeholder">
                    <i className="bi bi-person-x fs-2"></i>
                </div>
                <h6 className="text-muted mb-1">Sin Jefatura Asignada</h6>
                <p className="text-muted small mb-0">Haga clic en <strong>Asignar</strong> para buscar y establecer un responsable para este departamento.</p>
            </div>
        );
    };

    return (
        <div className="bg-white p-4 rounded shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 text-primary fw-bold d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center detalles-jefe-icon-container">
                        <i className="bi bi-person-badge fs-5"></i>
                    </div>
                    Director / Jefatura
                </h5>
                {!enEdicion && (
                    <div className="d-flex gap-2">
                        {departamento.rutJefe && (
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleGuardarJefe(true)} title="Quitar jefatura">
                                <i className="bi bi-person-dash me-1"></i>Dejar sin jefe
                            </button>
                        )}
                        <button type="button" className={`btn ${departamento.rutJefe ? 'btn-outline-primary btn-sm' : 'btn-primary btn-sm'}`} onClick={handleEditar}>
                            <i className={`bi ${departamento.rutJefe ? 'bi-pencil' : 'bi-plus-circle'} me-1`}></i>{departamento.rutJefe ? 'Editar' : 'Asignar'}
                        </button>
                    </div>
                )}
            </div>

            {renderJefaturaContent()}
        </div>
    );
};

export default JefaturaDepartamento;
