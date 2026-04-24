import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { buscarFuncionariosPorNombre } from '../../services/funcionarioService';

const ModalBuscarPorNombre = ({ show, onClose, onSelected }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [funcionarios, setFuncionarios] = useState([]);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    // Paginación
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        if (!show) {
            setSearchTerm('');
            setFuncionarios([]);
            setSelectedFuncionario(null);
            setError('');
            setSearched(false);
            setCurrentPage(0);
            setTotalPages(0);
            setTotalItems(0);
        }
    }, [show]);

    const fetchPage = useCallback(async (pattern, pageNumber) => {
        setSearching(true);
        setError('');
        try {
            const data = await buscarFuncionariosPorNombre(pattern, pageNumber);
            setFuncionarios(data.funcionarios || []);
            setCurrentPage(data.currentPage ?? pageNumber);
            setTotalPages(data.totalPages ?? 0);
            setTotalItems(data.totalItems ?? 0);
            setSelectedFuncionario(null);
            setSearched(true);
        } catch (err) {
            console.error('Error al buscar:', err);
            setError('Ocurrió un error al realizar la búsqueda. Intente nuevamente.');
        } finally {
            setSearching(false);
        }
    }, []);

    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        fetchPage(searchTerm, 0);
    };

    const handlePageChange = (newPage) => {
        fetchPage(searchTerm, newPage);
    };

    const handleSelectFuncionario = (func) => {
        setSelectedFuncionario(func);
        setError('');
    };

    const handleConfirm = () => {
        if (selectedFuncionario) {
            onSelected(selectedFuncionario);
            onClose();
        } else {
            setError('Por favor, seleccione un funcionario de la lista.');
        }
    };

    const getVisiblePages = () => {
        const range = 2;
        const start = Math.max(0, currentPage - range);
        const end = Math.min(totalPages - 1, currentPage + range);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div
            className={`modal fade ${show ? 'show d-block' : ''}`}
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content shadow">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-person-search me-2"></i>Buscar Funcionario
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">

                        {/* Buscador */}
                        <div className="mb-3">
                            <label htmlFor="searchTerm" className="form-label">Nombre o apellido</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchTerm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Ingrese nombre o apellido..."
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    autoFocus
                                />
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={handleSearch}
                                    disabled={searching || !searchTerm.trim()}
                                >
                                    {searching
                                        ? <><output className="spinner-border spinner-border-sm me-2"></output>Buscando...</>
                                        : <><i className="bi bi-search me-1"></i>Buscar</>
                                    }
                                </button>
                            </div>
                            <div className="form-text">Presione Enter o haga clic en Buscar</div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="alert alert-danger py-2">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                            </div>
                        )}

                        {/* Sin resultados */}
                        {!searching && searched && funcionarios.length === 0 && !error && (
                            <p className="text-muted text-center py-3">
                                <i className="bi bi-person-x me-2"></i>No se encontraron funcionarios con «{searchTerm}»
                            </p>
                        )}

                        {/* Tabla de resultados */}
                        {!searching && funcionarios.length > 0 && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small className="text-muted">
                                        <strong>{totalItems}</strong> funcionario(s) encontrado(s)
                                        {totalPages > 1 && <> — Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong></>}
                                    </small>
                                    {selectedFuncionario && (
                                        <small className="text-success">
                                            <i className="bi bi-check-circle me-1"></i>
                                            <strong>{selectedFuncionario.nombreCompleto}</strong> seleccionado
                                        </small>
                                    )}
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover table-sm align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: 130 }}>RUT</th>
                                                <th>Nombre Completo</th>
                                                <th style={{ width: 110 }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {funcionarios.map((func) => {
                                                const isSelected = selectedFuncionario?.rut === func.rut;
                                                return (
                                                    <tr
                                                        key={func.rut}
                                                        onClick={() => handleSelectFuncionario(func)}
                                                        className={isSelected ? 'table-primary' : ''}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td>
                                                            <code className="small">{func.rut}-{func.vrut}</code>
                                                        </td>
                                                        <td>{func.nombreCompleto}</td>
                                                        <td className="text-end">
                                                            <button
                                                                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
                                                                onClick={(e) => { e.stopPropagation(); handleSelectFuncionario(func); }}
                                                            >
                                                                {isSelected ? <><i className="bi bi-check2 me-1"></i>Seleccionado</> : 'Seleccionar'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Paginación */}
                                {totalPages > 1 && (
                                    <nav className="mt-3 d-flex justify-content-center">
                                        <ul className="pagination pagination-sm mb-0">
                                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(0)} title="Primera página">
                                                    <i className="bi bi-chevron-double-left"></i>
                                                </button>
                                            </li>
                                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} title="Página anterior">
                                                    <i className="bi bi-chevron-left"></i>
                                                </button>
                                            </li>
                                            {getVisiblePages().map(i => (
                                                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(i)}>
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} title="Página siguiente">
                                                    <i className="bi bi-chevron-right"></i>
                                                </button>
                                            </li>
                                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(totalPages - 1)} title="Última página">
                                                    <i className="bi bi-chevron-double-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button
                            className="btn btn-success"
                            onClick={handleConfirm}
                            disabled={!selectedFuncionario}
                        >
                            <i className="bi bi-check-circle me-2"></i>Confirmar Selección
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
    onSelected: PropTypes.func.isRequired,
};

export default ModalBuscarPorNombre;