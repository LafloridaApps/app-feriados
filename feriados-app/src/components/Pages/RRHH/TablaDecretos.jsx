import React from 'react';
import PropTypes from 'prop-types';
import { formatFechaString } from '../../../services/utils';

const TablaDecretos = ({ data, selectedItems, onSelectItem, onSelectAll, requestSort, sortConfig }) => {
    const allSelected = data.length > 0 && data.every(item => selectedItems.includes(item.idSolicitud));


    const getSortDirectionClass = (key) => {
        if (!sortConfig || sortConfig.key !== key) {
            return 'text-muted'; // No sort or not sorted by this key
        }
        return sortConfig.direction === 'ascending' ? 'bi-sort-up' : 'bi-sort-down';
    };

    const renderHeader = (label, key) => (
        <th onClick={() => requestSort(key)} style={{ cursor: 'pointer' }}>
            {label} <i className={`bi ${getSortDirectionClass(key)}`}></i>
        </th>
    );

    return (
        <div className="table-responsive mt-2">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th className="px-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={allSelected}
                                onChange={onSelectAll}
                            />
                        </th>
                        {renderHeader('Id', 'idSolicitud')}
                        {renderHeader('Rut', 'rut')}
                        {renderHeader('Funcionario', 'nombres')}
                        {renderHeader('Depto', 'departamento')}
                        {renderHeader('Desde', 'desde')}
                        {renderHeader('Hasta', 'hasta')}
                        {renderHeader('Jornada', 'jornada')}
                        {renderHeader('Días', 'duracion')}
                        {renderHeader('F. Solicitud', 'fechaSolicitud')}
                        {renderHeader('Tipo', 'tipoSolicitud')}
                        {renderHeader('Contrato', 'tipoContrato')}
                        <th className="text-center">Doc</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={`${item.idSolicitud}-${index}`}>
                            <td className="px-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={selectedItems.includes(item.idSolicitud)}
                                    onChange={() => onSelectItem(item.idSolicitud)}
                                />
                            </td>
                            <td className="fw-bold text-primary">#{item.idSolicitud}</td>
                            <td className="text-nowrap">{item.rut}</td>
                            <td className="fw-500">{item.nombres}</td>
                            <td className="small text-muted">{item.departamento}</td>
                            <td>{formatFechaString(item.desde)}</td>
                            <td>{formatFechaString(item.hasta)}</td>
                            <td>
                                <span className={`badge ${item.jornada === 'Completa' ? 'bg-primary' : 'bg-info'} bg-opacity-10 text-dark fw-normal border`}>
                                    {item.jornada}
                                </span>
                            </td>
                            <td className="text-center fw-bold">{item.duracion}</td>
                            <td className="small text-muted">{formatFechaString(item.fechaSolicitud)}</td>
                            <td>
                                <span className="small">{item.tipoSolicitud}</span>
                            </td>
                            <td>
                                <span className="small text-muted">{item.tipoContrato}</span>
                            </td>
                            <td className="text-center">
                                {item.url && (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light border text-danger shadow-sm">
                                        <i className="bi bi-file-earmark-pdf-fill"></i>
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

TablaDecretos.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        rut: PropTypes.string.isRequired,
        nombres: PropTypes.string.isRequired,
        apellidos: PropTypes.string.isRequired,
        departamento: PropTypes.string.isRequired,
        desde: PropTypes.string.isRequired,
        hasta: PropTypes.string.isRequired,
        jornada: PropTypes.string.isRequired,
        duracion: PropTypes.number.isRequired,
        fechaSolicitud: PropTypes.string.isRequired,
        tipoSolicitud: PropTypes.string.isRequired,
        tipoContrato: PropTypes.string.isRequired,
        url: PropTypes.string,
    })).isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectItem: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    requestSort: PropTypes.func.isRequired,
    sortConfig: PropTypes.shape({
        key: PropTypes.string,
        direction: PropTypes.string,
    }).isRequired,
};

export default TablaDecretos;