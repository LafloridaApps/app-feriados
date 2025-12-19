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
        <div className="table-responsive mt-4">
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={onSelectAll}
                            />
                        </th>
                        {renderHeader('Id', 'idSolicitud')}
                        {renderHeader('Rut', 'rut')}
                        {renderHeader('Nombre', 'nombres')}
                        {renderHeader('Departamento', 'departamento')}
                        {renderHeader('Fecha Desde', 'desde')}
                        {renderHeader('Fecha Hasta', 'hasta')}
                        {renderHeader('Jornada', 'jornada')}
                        {renderHeader('Duración', 'duracion')}
                        {renderHeader('Fecha Solicitud', 'fechaSolicitud')}
                        {renderHeader('Tipo Solicitud', 'tipoSolicitud')}
                        {renderHeader('Contrato', 'tipoContrato')}
                        <th>Documento</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={`${item.idSolicitud}-${index}`}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.idSolicitud)}
                                    onChange={() => onSelectItem(item.idSolicitud)}
                                />
                            </td>
                            <td>{item.idSolicitud}</td>
                            <td>{item.rut}</td>
                            <td>{item.nombres}</td>
                            <td>{item.departamento}</td>
                            <td>{formatFechaString(item.desde)}</td>
                            <td>{formatFechaString(item.hasta)}</td>
                            <td>{item.jornada}</td>
                            <td>{item.duracion}</td>
                            <td>{formatFechaString(item.fechaSolicitud)}</td>
                            <td>{item.tipoSolicitud}</td>
                            <td>{item.tipoContrato}</td>
                            <td>
                                {item.url && (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
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