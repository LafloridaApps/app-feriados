import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { UsuarioContext } from '../../../../context/UsuarioContext';
import { useGestionSolicitudes } from '../../../../hooks/useGestionSolicitudes';
import TrazabilidadCard from './components/TrazabilidadCard';
import SearchSolicitud from './components/SearchSolicitud';
import './GestionSolicitudes.css';

export const GestionSolicitudes = () => {
    const funcionario = useContext(UsuarioContext);
    const [solicitudId, setSolicitudId] = useState('');
    const {
        solicitud, loading, error,
        buscarSolicitud, handleAnularDirecto
    } = useGestionSolicitudes();

    const handleSearch = (e) => {
        e.preventDefault();
        if (solicitudId) {
            buscarSolicitud(solicitudId);
        }
    };

    const handleAnular = async () => {
        const idSol = solicitud.id || solicitud.idSolicitud;
        const result = await Swal.fire({
            title: '¿Anular Solicitud?',
            html: `¿Está seguro de que desea anular la solicitud <strong>#${idSol}</strong>?<br><br>Por favor, ingrese el motivo (glosa) para dejar constancia:`,
            input: 'textarea',
            inputPlaceholder: 'Ej: Solicitud duplicada, error en fechas...',
            inputAttributes: { rows: 4, maxlength: 300 },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="bi bi-x-circle me-1"></i> Sí, anular',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value?.trim()) return 'Debe ingresar un motivo para anular.';
            }
        });

        if (result.isConfirmed && result.value) {
            const rutAprobador = funcionario?.rut ? Number.parseInt(String(funcionario.rut).split('-')[0].replaceAll('.', ''), 10) : 0;
            await handleAnularDirecto(idSol, result.value.trim(), rutAprobador);
        }
    };

    const renderButtonContent = () => {
        if (loading) {
            return <><output className="spinner-border spinner-border-sm me-2" aria-hidden="true"></output>Procesando...</>;
        }
        if (solicitud.estadoSolicitud === 'ANULADA') {
            return <><i className="bi bi-ban me-2"></i>Solicitud Anulada</>;
        }
        return <><i className="bi bi-x-circle-fill me-2"></i>Anular Solicitud</>;
    };

    const mostrarBotonAnular = solicitud && solicitud.estadoSolicitud !== 'ANULADA' && !solicitud.estadoSolicitud.includes('PENDIENTE');

    return (
        <div className="container-fluid mt-4 mb-5 fade-in">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-1 text-primary fw-bold">Visor de Solicitudes</h2>
                    <p className="text-muted mb-0">Consulte el estado, trazabilidad y gestione la anulación de solicitudes.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm border mb-4">
                <SearchSolicitud
                    solicitudId={solicitudId}
                    setSolicitudId={setSolicitudId}
                    handleSearch={handleSearch}
                    loading={loading && !solicitud}
                />
            </div>

            {error && (
                <div className="alert alert-danger shadow-sm border-0 rounded-3 mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
            )}

            {solicitud && (
                <div className="row g-4">
                    <div className="col-lg-5 col-xl-4">
                        <div className="bg-white p-3 rounded shadow-sm border h-100 d-flex flex-column">
                            <h5 className="text-primary fw-bold mb-4 border-bottom pb-3 d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                                    <i className="bi bi-file-earmark-text fs-5"></i>
                                </div>
                                Detalles de la Solicitud #{solicitud.id}
                            </h5>
                            
                            <div className="row g-4 mb-4 flex-grow-1">
                                <div className="col-12">
                                    <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-person-fill me-1"></i>Funcionario</span>
                                    <div className="fw-medium text-dark bg-light p-2 rounded border border-light d-flex justify-content-between align-items-center">
                                        <span>{solicitud.nombreFuncionario || 'N/A'}</span>
                                        <span className="badge bg-white text-secondary border">{solicitud.rutFuncionario || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-building me-1"></i>Departamento</span>
                                    <div className="fw-medium text-dark bg-light p-2 rounded border border-light">{solicitud.nombreDepartamento || 'N/A'}</div>
                                </div>
                                <div className="col-12">
                                    <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-tag-fill me-1"></i>Tipo Solicitud</span>
                                    <div><span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle px-3 py-2 w-100 text-start fs-6">{solicitud.tipoSolicitud || 'N/A'}</span></div>
                                </div>
                                <div className="col-6">
                                    <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-calendar-event me-1"></i>Desde</span>
                                    <div className="fw-medium text-dark"><span className="badge bg-light text-dark border px-3 py-2 w-100 text-center">{solicitud.fechaInicio || 'N/A'}</span></div>
                                </div>
                                <div className="col-6">
                                    <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-calendar-check me-1"></i>Hasta</span>
                                    <div className="fw-medium text-dark"><span className="badge bg-light text-dark border px-3 py-2 w-100 text-center">{solicitud.fechaFin || solicitud.fechaTermino || 'N/A'}</span></div>
                                </div>
                                <div className="col-12 mt-2 border-top pt-4 text-center">
                                    <span className="d-block text-muted small fw-bold text-uppercase mb-1"><i className="bi bi-info-circle-fill me-1"></i>Estado Actual</span>
                                    <span className={`badge ${solicitud.estadoSolicitud === 'ANULADA' ? 'bg-danger bg-opacity-10 text-danger border border-danger-subtle' : 'bg-primary bg-opacity-10 text-primary border border-primary-subtle'} rounded-pill px-4 py-2 fs-6 mt-1`}>
                                        {solicitud.estadoSolicitud || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {mostrarBotonAnular && (
                                <div className="d-flex justify-content-center border-top pt-3 mt-auto">
                                    <button 
                                        className="btn btn-outline-danger px-4 rounded-pill fw-bold shadow-sm w-100"
                                        onClick={handleAnular}
                                        disabled={loading}
                                    >
                                        {renderButtonContent()}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-7 col-xl-8">
                        <TrazabilidadCard derivaciones={solicitud.derivaciones} />
                    </div>
                </div>
            )}
        </div>
    );
};