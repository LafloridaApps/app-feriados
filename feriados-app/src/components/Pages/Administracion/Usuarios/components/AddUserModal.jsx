import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { getFuncionarioByRutAndVrut } from '../../../../../services/funcionarioService';

const AddUserModal = ({ show, onClose, onUserAdded }) => {
    const [rutBusqueda, setRutBusqueda] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!rutBusqueda.trim()) {
            Swal.fire('Error', 'Por favor, ingrese un RUT.', 'error');
            return;
        }

        if (rutBusqueda.includes('-')) {
            Swal.fire('Error', 'Por favor, ingrese el RUT sin dígito verificador.', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await getFuncionarioByRutAndVrut(rutBusqueda);
            setSearchResult(response);
        } catch (error) {
            console.error("Error al buscar funcionario:", error);
            Swal.fire('Error', 'No se pudo encontrar el funcionario.', 'error');
            setSearchResult(null);
        }
        setLoading(false);
    };

    const handleSelectUser = (user) => {
        onUserAdded(user);
        onClose();
    };

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar Nuevo Usuario</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSearch}>
                            <div className="mb-3">
                                <label className="form-label">RUT del Funcionario</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={rutBusqueda}
                                    onChange={(e) => setRutBusqueda(e.target.value)}
                                    placeholder="Ingrese RUT sin dígito verificador"
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? 'Buscando...' : 'Buscar'}
                            </button>
                        </form>

                        {searchResult && (
                            <div className="mt-4">
                                <h6>Resultado de la Búsqueda</h6>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>RUT</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{searchResult.nombre} {searchResult.apellidoPaterno} </td>
                                            <td>{searchResult.rut}-{searchResult.vrut}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleSelectUser(searchResult)}
                                                >
                                                    Agregar
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;