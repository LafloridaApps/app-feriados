import React from 'react';
import PropTypes from 'prop-types';

const TablaDecretos = ({ data, selectedItems, onSelectItem, onSelectAll }) => {
    const allSelected = data.length > 0 && data.every(item => selectedItems.includes(item.id));

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
                        <th>Rut</th>
                        <th>Nombre</th>
                        <th>Departamento</th>
                        <th>Fecha Desde</th>
                        <th>Fecha Hasta</th>
                        <th>Jornada</th>
                        <th>Duración</th>
                        <th>Fecha Solicitud</th>
                        <th>Tipo Solicitud</th>
                        <th>Contrato</th>
                        <th>Documento</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => onSelectItem(item.id)}
                                />
                            </td>
                            <td>{item.rut}</td>
                            <td>{item.nombre}</td>
                            <td>{item.departamento}</td>
                            <td>{item.fechaDesde}</td>
                            <td>{item.fechaHasta}</td>
                            <td>{item.jornada}</td>
                            <td>{item.duracion}</td>
                            <td>{item.fechaSolicitud}</td>
                            <td>{item.tipoSolicitud}</td>
                            <td>{item.contrato}</td>
                            <td>
                                {item.documento && (
                                    <a href="#" onClick={(e) => e.preventDefault()} className="text-decoration-none">
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
        id: PropTypes.number.isRequired,
        rut: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        departamento: PropTypes.string.isRequired,
        fechaDesde: PropTypes.string.isRequired,
        fechaHasta: PropTypes.string.isRequired,
        jornada: PropTypes.string.isRequired,
        duracion: PropTypes.number.isRequired,
        fechaSolicitud: PropTypes.string.isRequired,
        tipoSolicitud: PropTypes.string.isRequired,
        contrato: PropTypes.string.isRequired,
        documento: PropTypes.string.isRequired,
    })).isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.number).isRequired,
    onSelectItem: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
};

export default TablaDecretos;