import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const ModalBuscarDepartamento = ({ show, onClose, onSelected, departamentos }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepto, setSelectedDepto] = useState(null);

    // Flatten departments for easier searching
    const flatDepartamentos = useMemo(() => {
        const flatten = (nodes) => {
            let result = [];
            if (!Array.isArray(nodes)) return result;
            nodes.forEach(node => {
                result.push({ 
                    idDepto: node.id, 
                    nombreDepartamento: node.nombre 
                });
                if (node.dependencias && node.dependencias.length > 0) {
                    result = result.concat(flatten(node.dependencias));
                }
            });
            return result;
        };
        return flatten(departamentos);
    }, [departamentos]);

    // Filtered departments based on search term
    const filteredDepartamentos = useMemo(() => {
        if (!searchTerm.trim()) return flatDepartamentos;
        const lowerSearch = searchTerm.toLowerCase();
        return flatDepartamentos.filter(d => 
            d.nombreDepartamento.toLowerCase().includes(lowerSearch)
        );
    }, [flatDepartamentos, searchTerm]);

    useEffect(() => {
        if (!show) {
            setSearchTerm('');
            setSelectedDepto(null);
        }
    }, [show]);

    const handleConfirm = () => {
        if (selectedDepto) {
            onSelected(selectedDepto);
            onClose();
        }
    };

    return (
        <div
            className={`modal fade ${show ? 'show d-block' : ''}`}
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content shadow">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title">
                            <i className="bi bi-building-search me-2"></i>Buscar Departamento
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        {/* Search Input */}
                        <div className="mb-3">
                            <label htmlFor="searchDepto" className="form-label fw-bold">Nombre del Departamento</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-search"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchDepto"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Ingrese nombre para filtrar..."
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="table-responsive" style={{ maxHeight: '400px' }}>
                            {searchTerm.trim().length > 1 ? (
                                <table className="table table-hover table-sm align-middle mb-0">
                                    <thead className="table-light sticky-top">
                                        <tr>
                                            <th style={{ width: '80px' }}>ID</th>
                                            <th>Nombre del Departamento</th>
                                            <th style={{ width: '120px' }} className="text-end">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDepartamentos.length > 0 ? (
                                            filteredDepartamentos.map((depto) => {
                                                const isSelected = selectedDepto?.idDepto === depto.idDepto;
                                                return (
                                                    <tr
                                                        key={depto.idDepto}
                                                        onClick={() => setSelectedDepto(depto)}
                                                        className={isSelected ? 'table-primary' : ''}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td><span className="badge bg-secondary opacity-75">{depto.idDepto}</span></td>
                                                        <td className="fw-medium">{depto.nombreDepartamento}</td>
                                                        <td className="text-end">
                                                            <button
                                                                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedDepto(depto);
                                                                }}
                                                            >
                                                                {isSelected ? <i className="bi bi-check2"></i> : 'Seleccionar'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-muted">
                                                    No se encontraron departamentos que coincidan con la búsqueda.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-building fs-1 mb-3 d-block opacity-25"></i>
                                    <p>Ingrese al menos 2 caracteres para buscar un departamento...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer bg-light">
                        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button
                            className="btn btn-primary px-4"
                            onClick={handleConfirm}
                            disabled={!selectedDepto}
                        >
                            <i className="bi bi-check-circle me-2"></i>Confirmar Selección
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ModalBuscarDepartamento.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelected: PropTypes.func.isRequired,
    departamentos: PropTypes.array.isRequired
};

export default ModalBuscarDepartamento;
