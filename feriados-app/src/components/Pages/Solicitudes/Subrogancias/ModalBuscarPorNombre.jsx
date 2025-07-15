
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ModalBuscarPorNombre = ({ show, onClose, onFuncionarioSelected }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFuncionarios, setFilteredFuncionarios] = useState([]);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);
    const [error, setError] = useState('');

    // Limpiar estados cuando el modal se cierra
    useEffect(() => {
        if (!show) {
            setSearchTerm('');
            setFilteredFuncionarios([]);
            setSelectedFuncionario(null);
            setError('');
        }
    }, [show]);

    const handleSearch = () => {
        setError('');
        setSelectedFuncionario(null);

       
    };

    const handleSelectFuncionario = (funcionario) => {
        setSelectedFuncionario(funcionario);
        setError(''); // Limpiar cualquier error al seleccionar
    };

    const handleConfirm = () => {
        if (selectedFuncionario) {
            onFuncionarioSelected(selectedFuncionario);
            onClose(); // Cerrar este modal
        } else {
            setError('Por favor, seleccione un funcionario de la lista.');
        }
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg"> {/* Modal más grande para la tabla */}
                <div className="modal-content shadow">
                    <div className="modal-header">
                        <h5 className="modal-title">Buscar Funcionario por Nombre</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="searchTerm" className="form-label">Nombre del Funcionario</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchTerm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                />
                                <button className="btn btn-outline-primary" type="button" onClick={handleSearch}>
                                    Buscar
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-danger mt-3">
                                {error}
                            </div>
                        )}

                        {filteredFuncionarios.length > 0 && (
                            <div className="mt-4">
                                <h6>Resultados de la búsqueda:</h6>
                                <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table className="table table-hover table-striped">
                                        <thead>
                                            <tr>
                                                <th>RUT</th>
                                                <th>Nombre</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredFuncionarios.map(func => (
                                                <tr key={func.rut} className={selectedFuncionario?.rut === func.rut ? 'table-primary' : ''}>
                                                    <td>{func.rut}</td>
                                                    <td>{func.nombre}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-info"
                                                            onClick={() => handleSelectFuncionario(func)}
                                                            disabled={selectedFuncionario?.rut === func.rut}
                                                        >
                                                            {selectedFuncionario?.rut === func.rut ? 'Seleccionado' : 'Seleccionar'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {selectedFuncionario && (
                            <div className="alert alert-success mt-3">
                                <strong>Funcionario Seleccionado:</strong> {selectedFuncionario.nombre} (RUT: {selectedFuncionario.rut})
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button className="btn btn-success" onClick={handleConfirm} disabled={!selectedFuncionario}>
                            Confirmar Selección
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ModalBuscarPorNombre.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onFuncionarioSelected: PropTypes.func.isRequired, // Para pasar el funcionario seleccionado de vuelta
};

export default ModalBuscarPorNombre;