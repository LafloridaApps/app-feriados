import { useState, useMemo } from 'react';
import SolicitudItem from './SolicitudItem';
import SolicitudItemMobile from './SolicitudItemMobile';
import FiltrosSolicitudes from './FiltroSolicitudes';
import { useInboxSolicitudes } from '../../../hooks/useInboxSolicitudes';
import { formatFecha } from '../../../services/utils';
import './Inbox.css';
import InformesTab from './InformesTab';

const InboxSolicitudes = () => {
    const [activeTab, setActiveTab] = useState('inbox');
    const {
        isMobile,
        rutFuncionario,
        currentPage,
        totalPages,
        totalElements,
        isSubrogante,
        detalleAbiertoId,
        handleVerDetalleClick,
        handleActualizarSolicitud,
        handleFiltrarSolicitudes,
        handlePageChange,
        requestSort,
        sortConfig,
        sortedItems,
        handlerEntrada,
        handlerVisar,
        handlerAprobar,
        noLeidas,
        setNoLeidas
    } = useInboxSolicitudes();


    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === 'ascending'
            ? <i className="bi bi-sort-up ms-1"></i>
            : <i className="bi bi-sort-down ms-1"></i>;
    };

    const itemsToDisplay = useMemo(() => {
        if (!noLeidas) return sortedItems;
        return sortedItems.filter(solicitud => {
            const derivacionActiva = solicitud.derivaciones?.[0];
            const estado = (solicitud.estadoSolicitud || '').trim().toUpperCase();
            return derivacionActiva?.recepcionada === false && estado !== 'ANULADA' && estado !== 'RECHAZADA';
        });
    }, [sortedItems, noLeidas]);

    const traslapes = useMemo(() => {
        const overlaps = [];
        const checked = new Set();
        
        // Función robusta para transformar string a milisegundos evitando "Invalid Date"
        const parseSafeDate = (dateStr) => {
            if (!dateStr) return 0;
            const [datePart] = dateStr.split('T');
            const parts = datePart.split(/[-/]/);
            if (parts.length === 3) {
                if (parts[0].length === 4) {
                    return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
                } else if (parts[2].length === 4) {
                    return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
                }
            }
            return new Date(dateStr).getTime();
        };

        const getEstado = (s) => (s.estadoSolicitud || '').trim().toUpperCase();

        // Consideramos TODAS las solicitudes válidas
        const validas = sortedItems.filter(s => {
            const estado = getEstado(s);
            return estado !== 'ANULADA' && estado !== 'RECHAZADA' && estado !== 'POSTERGADA';
        });

        // Solo tomaremos como base de análisis las pendientes
        const pendientes = validas.filter(s => {
            const estado = getEstado(s);
            // Excluimos explícitamente todos los estados que indican que el trámite ya terminó
            return !['FINALIZADA', 'APROBADA', 'DECRETADA', 'FIRMADA', 'TRAMITADA'].includes(estado);
        });

        const MS_MARGINA = 3 * 24 * 60 * 60 * 1000; // Margen de 3 días para detectar fechas "próximas"

        pendientes.forEach(sol => {
            if (checked.has(sol.id)) return;
            if (!sol.fechaInicio) return;

            const start1 = parseSafeDate(sol.fechaInicio);
            const end1 = parseSafeDate(sol.fechaFin || sol.fechaTermino || sol.fechaInicio);
            const depto1Name = sol.nombreDepartamento || 'Desconocido';
            const depto1Key = depto1Name.trim().toLowerCase();

            if (!start1 || !end1) return;

            const group = [sol];

            validas.forEach(other => {
                if (sol.id === other.id) return;
                if (!other.fechaInicio) return;

                const start2 = parseSafeDate(other.fechaInicio);
                const end2 = parseSafeDate(other.fechaFin || other.fechaTermino || other.fechaInicio);
                const depto2Key = (other.nombreDepartamento || 'Desconocido').trim().toLowerCase();

                if (!start2 || !end2) return;

                if (depto1Key === depto2Key && start1 <= (end2 + MS_MARGINA) && start2 <= (end1 + MS_MARGINA)) {
                    group.push(other);
                }
            });

            if (group.length > 1) {
                const uniqueGroup = Array.from(new Map(group.map(item => [item.id, item])).values());
                uniqueGroup.forEach(item => checked.add(item.id));
                
                overlaps.push({
                    id: sol.id,
                    departamento: depto1Name,
                    solicitudes: uniqueGroup
                });
            }
        });

        return overlaps;
    }, [sortedItems]);


    return (
        <div className="container-fluid mt-4">
            <FiltrosSolicitudes onFiltrar={handleFiltrarSolicitudes} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white pt-3 pb-0 border-bottom">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0 font-weight-bold text-primary">
                                    Bandeja de Solicitudes {isSubrogante && <span className='badge bg-info ms-2'>Subrogante</span>}
                                </h5>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="noLeidas"
                                        checked={noLeidas}
                                        onChange={(e) => setNoLeidas(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="noLeidas">
                                        No Leídas
                                    </label>
                                </div>
                            </div>
                            <ul className="nav nav-tabs border-bottom-0">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'inbox' ? 'active text-primary fw-bold' : 'text-secondary'}`}
                                        onClick={() => setActiveTab('inbox')}
                                        style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
                                    >
                                        <i className="bi bi-inbox-fill me-2"></i> Lista de Solicitudes
                                    </button>
                                </li>
                                <li className="nav-item ms-2">
                                    <button
                                        className={`nav-link ${activeTab === 'traslapes' ? 'active text-danger fw-bold' : 'text-danger opacity-75'}`}
                                        onClick={() => setActiveTab('traslapes')}
                                        style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
                                    >
                                        <i className="bi bi-shield-exclamation me-2"></i> Análisis de Cobertura
                                        {traslapes.length > 0 && (
                                            <span className="badge bg-danger rounded-pill ms-2">{traslapes.length}</span>
                                        )}
                                    </button>
                                </li>
                                <li className="nav-item ms-2">
                                    <button
                                        className={`nav-link ${activeTab === 'informes' ? 'active text-success fw-bold' : 'text-secondary'}`}
                                        onClick={() => setActiveTab('informes')}
                                        style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
                                    >
                                        <i className="bi bi-bar-chart-fill me-2"></i> Informes
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body p-0">
                            {activeTab === 'inbox' && (
                                <>
                                    <div className="table-responsive d-none d-md-block">
                                        <table className="table table-hover align-middle mb-0 border-top">
                                            <thead className="table-light text-secondary">
                                                <tr>
                                                    <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }} className="ps-4 py-3 border-0">
                                                        <i className="bi bi-hash me-1"></i> ID {getSortIcon('id')}
                                                    </th>
                                                    <th onClick={() => requestSort('nombreFuncionario')} style={{ cursor: 'pointer' }} className="py-3 border-0">
                                                        <i className="bi bi-person-fill me-1"></i> Solicitante {getSortIcon('nombreFuncionario')}
                                                    </th>
                                                    <th onClick={() => requestSort('tipoSolicitud')} style={{ cursor: 'pointer' }} className="py-3 border-0">
                                                        <i className="bi bi-tag-fill me-1"></i> Tipo {getSortIcon('tipoSolicitud')}
                                                    </th>
                                                    <th onClick={() => requestSort('fechaSolicitud')} style={{ cursor: 'pointer' }} className="py-3 border-0">
                                                        <i className="bi bi-calendar-date me-1"></i> Solicitud {getSortIcon('fechaSolicitud')}
                                                    </th>
                                                    <th onClick={() => requestSort('estadoSolicitud')} style={{ cursor: 'pointer' }} className="py-3 border-0">
                                                        <i className="bi bi-info-circle-fill me-1"></i> Estado {getSortIcon('estadoSolicitud')}
                                                    </th>
                                                    <th className="text-center py-3 border-0"><i className="bi bi-gear-fill me-1"></i> Acciones</th>
                                                    <th className="text-center py-3 border-0"><i className="bi bi-eye-fill me-1"></i> Detalle</th>
                                                    <th className='text-center pe-4 py-3 border-0'><i className="bi bi-file-earmark-pdf-fill me-1"></i> PDF</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {itemsToDisplay.map((solicitud) => (
                                                    <SolicitudItem
                                                        key={solicitud.id}
                                                        solicitud={solicitud}
                                                        onActualizarSolicitud={handleActualizarSolicitud}
                                                        rutFuncionario={rutFuncionario}
                                                        handlerEntrada={handlerEntrada}
                                                        handlerVisar={handlerVisar}
                                                        open={detalleAbiertoId === solicitud.id}
                                                        handlerAprobar={handlerAprobar}
                                                        handleVerDetalleClick={() => handleVerDetalleClick(solicitud.id)}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {isMobile && (
                                        <div>
                                            {itemsToDisplay.map((solicitud) => (
                                                <SolicitudItemMobile
                                                    key={solicitud.id}
                                                    solicitud={solicitud}
                                                    open={detalleAbiertoId === solicitud.id}
                                                    handlerEntrada={handlerEntrada}
                                                    handlerVisar={handlerVisar}
                                                    handlerAprobar={handlerAprobar}
                                                    rutFuncionario={rutFuncionario}
                                                    onActualizarSolicitud={handleActualizarSolicitud}
                                                    handleVerDetalleClick={() => handleVerDetalleClick(solicitud.id)}
                                                />
                                            ))}
                                            {itemsToDisplay.length === 0 && (
                                                <div className="p-4 text-center text-muted">
                                                    No se encontraron solicitudes con los filtros aplicados.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                            {activeTab === 'traslapes' && (
                                <div className="p-4 bg-light" style={{ minHeight: '400px' }}>
                                    <div className="alert alert-info border-0 shadow-sm mb-4">
                                        <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                                        <strong>Información de Cobertura:</strong> El siguiente listado agrupa las solicitudes de tu bandeja que comparten departamento y tienen fechas superpuestas. Revisa estas coincidencias de forma informativa antes de visar o firmar para asegurar la continuidad del servicio.
                                    </div>
                                    
                                    {traslapes.length === 0 ? (
                                        <div className="text-center p-5 bg-white rounded-3 shadow-sm border text-muted">
                                            <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
                                            <h5 className="fw-bold">Todo en orden</h5>
                                            <p className="mb-0">No se han detectado solicitudes pendientes con fechas traslapadas en el mismo departamento.</p>
                                        </div>
                                    ) : (
                                        <div className="row g-4">
                                            {traslapes.map(grupo => (
                                                <div className="col-12" key={grupo.id}>
                                                    <div className="card border-warning shadow-sm">
                                                        <div className="card-header bg-warning bg-opacity-10 border-warning py-3 d-flex align-items-center">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-warning text-dark rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px' }}>
                                                                    <i className="bi bi-buildings-fill fs-5"></i>
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0 fw-bold text-dark">Departamento: {grupo.departamento}</h6>
                                                                    <small className="text-muted">Traslape de {grupo.solicitudes.length} solicitudes detectado</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-body p-0">
                                                            <div className="table-responsive">
                                                                <table className="table table-hover align-middle mb-0">
                                                                    <thead className="table-light">
                                                                        <tr>
                                                                            <th className="ps-4">ID</th>
                                                                            <th>Funcionario</th>
                                                                            <th>Tipo</th>
                                                                            <th>Desde</th>
                                                                            <th>Hasta</th>
                                                                            <th className="pe-4 text-end">Estado</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {grupo.solicitudes.map(sol => (
                                                                            <tr key={sol.id}>
                                                                                <td className="ps-4 fw-bold text-secondary">#{sol.id}</td>
                                                                                <td>
                                                                                    <div className="d-flex align-items-center">
                                                                                        {sol.nombreFuncionario}
                                                                                    </div>
                                                                                </td>
                                                                                <td><span className="badge bg-secondary bg-opacity-10 text-secondary border">{sol.tipoSolicitud}</span></td>
                                                                                <td><i className="bi bi-calendar-event me-2 text-muted"></i>{sol.fechaInicio ? formatFecha(sol.fechaInicio) : 'N/A'}</td>
                                                                                <td><i className="bi bi-calendar-check me-2 text-muted"></i>{(sol.fechaFin || sol.fechaTermino) ? formatFecha(sol.fechaFin || sol.fechaTermino) : 'N/A'}</td>
                                                                                <td className="pe-4 text-end">
                                                                                    <span className="badge bg-primary rounded-pill">{sol.estadoSolicitud}</span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'informes' && (
                                <div className="p-4 bg-white" style={{ minHeight: '400px' }}>
                                    <InformesTab />
                                </div>
                            )}
                        </div>
                        {activeTab === 'inbox' && (
                            <div className="card-footer d-flex justify-content-between align-items-center">
                                <div className="text-muted">
                                    Mostrando {itemsToDisplay.length} de {totalElements} solicitudes
                                </div>
                                <nav>
                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                                Anterior
                                            </button>
                                        </li>
                                        <li className="page-item">
                                            <span className="page-link">{currentPage + 1} de {totalPages}</span>
                                        </li>
                                        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                                Siguiente
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InboxSolicitudes;