import PropTypes from 'prop-types';
import SolicitudItem from './SolicitudItem';

const getSortIcon = (sortConfig, key) => {
    if (sortConfig.key !== key) {
        return null;
    }
    return sortConfig.direction === 'ascending'
        ? <i className="bi bi-sort-up ms-1"></i>
        : <i className="bi bi-sort-down ms-1"></i>;
};

const InboxTable = ({
    itemsToDisplay,
    sortConfig,
    requestSort,
    rutFuncionario,
    handleActualizarSolicitud,
    handlerEntrada,
    handlerVisar,
    handlerAprobar,
    detalleAbiertoId,
    handleVerDetalleClick
}) => {
    return (
        <div className="table-responsive d-none d-md-block">
            <table className="table table-hover align-middle mb-0 border-top">
                <thead className="table-light text-secondary">
                    <tr>
                        <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }} className="ps-4 py-3 border-0">
                            <i className="bi bi-hash me-1"></i> ID {getSortIcon(sortConfig, 'id')}
                        </th>
                        <th onClick={() => requestSort('nombreFuncionario')} style={{ cursor: 'pointer' }} className="py-3 border-0">
                            <i className="bi bi-person-fill me-1"></i> Solicitante {getSortIcon(sortConfig, 'nombreFuncionario')}
                        </th>
                        <th onClick={() => requestSort('tipoSolicitud')} style={{ cursor: 'pointer' }} className="py-3 border-0">
                            <i className="bi bi-tag-fill me-1"></i> Tipo {getSortIcon(sortConfig, 'tipoSolicitud')}
                        </th>
                        <th onClick={() => requestSort('fechaSolicitud')} style={{ cursor: 'pointer' }} className="py-3 border-0">
                            <i className="bi bi-calendar-date me-1"></i> Solicitud {getSortIcon(sortConfig, 'fechaSolicitud')}
                        </th>
                        <th onClick={() => requestSort('estadoSolicitud')} style={{ cursor: 'pointer' }} className="py-3 border-0">
                            <i className="bi bi-info-circle-fill me-1"></i> Estado {getSortIcon(sortConfig, 'estadoSolicitud')}
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
    );
};

InboxTable.propTypes = {
    itemsToDisplay: PropTypes.array.isRequired,
    sortConfig: PropTypes.shape({
        key: PropTypes.string,
        direction: PropTypes.string,
    }).isRequired,
    requestSort: PropTypes.func.isRequired,
    rutFuncionario: PropTypes.string.isRequired,
    handleActualizarSolicitud: PropTypes.func.isRequired,
    handlerEntrada: PropTypes.func.isRequired,
    handlerVisar: PropTypes.func.isRequired,
    handlerAprobar: PropTypes.func.isRequired,
    detalleAbiertoId: PropTypes.number,
    handleVerDetalleClick: PropTypes.func.isRequired,
};

export default InboxTable;
