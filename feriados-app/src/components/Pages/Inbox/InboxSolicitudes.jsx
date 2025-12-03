import SolicitudItem from './SolicitudItem';
import SolicitudItemMobile from './SolicitudItemMobile';
import FiltrosSolicitudes from './FiltroSolicitudes';
import { useInboxSolicitudes } from '../../../hooks/useInboxSolicitudes';

const InboxSolicitudes = () => {
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
        solicitudesFiltradas,
        noLeidas,
        setNoLeidas
    } = useInboxSolicitudes();

    console.log(isSubrogante)

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === 'ascending'
            ? <i className="bi bi-sort-up ms-1"></i>
            : <i className="bi bi-sort-down ms-1"></i>;
    };



    return (
        <div className="container-fluid mt-4">
            <FiltrosSolicitudes onFiltrar={handleFiltrarSolicitudes} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
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
                        <div className="card-body p-0">
                            <div className="table-responsive d-none d-md-block">
                                <table className="table table-striped table-hover mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>
                                                <i className="bi bi-hash me-2"></i> ID {getSortIcon('id')}
                                            </th>
                                            <th onClick={() => requestSort('nombreFuncionario')} style={{ cursor: 'pointer' }}>
                                                <i className="bi bi-person-fill me-2"></i> Solicitante {getSortIcon('nombreFuncionario')}
                                            </th>
                                            <th onClick={() => requestSort('tipoSolicitud')} style={{ cursor: 'pointer' }}>
                                                <i className="bi bi-type me-2"></i> Tipo Solicitud {getSortIcon('tipoSolicitud')}
                                            </th>
                                            <th onClick={() => requestSort('fechaSolicitud')} style={{ cursor: 'pointer' }}>
                                                <i className="bi bi-calendar-date me-2"></i> Fecha Solicitud {getSortIcon('fechaSolicitud')}
                                            </th>
                                            <th onClick={() => requestSort('estadoSolicitud')} style={{ cursor: 'pointer' }}>
                                                <i className="bi bi-exclamation-circle-fill me-2"></i> Estado Solicitud {getSortIcon('estadoSolicitud')}
                                            </th>
                                            <th className="text-right"><i className="bi bi-gear-fill me-2"></i> Acciones</th>
                                            <th className="text-right"><i className="bi bi-info-circle-fill me-2"></i> Detalle</th>
                                            <th className='text-right'><i className="bi bi-file-earmark-pdf me-23"> Pdf</i></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedItems.map((solicitud) => (
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
                                    {sortedItems.map((solicitud) => (
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
                                    {solicitudesFiltradas.length === 0 && (
                                        <div className="p-4 text-center text-muted">
                                            No se encontraron solicitudes con los filtros aplicados.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <div className="text-muted">
                                Mostrando {solicitudesFiltradas.length} de {totalElements} solicitudes
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InboxSolicitudes;