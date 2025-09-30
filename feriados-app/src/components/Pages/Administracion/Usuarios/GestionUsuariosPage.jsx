import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { listarUsuarios } from '../../../../services/usuarioService';
import UserTable from './components/UserTable';
import AddUserModal from './components/AddUserModal';
import ManageUserModulesModal from './components/ManageUserModulesModal';
import './GestionUsuariosPage.css'; // Importar el archivo CSS personalizado

const GestionUsuariosPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const getUsuario = async () => {
            try {
                const response = await listarUsuarios();
                setUsuarios(response);
            } catch (error) {
                console.error("Error al listar usuarios:", error);
                Swal.fire('Error', 'No se pudo cargar la lista de usuarios.', 'error');
            }
        }
        getUsuario();
    }, []);

    useEffect(() => {
        const isModalOpen = showAddModal || showManageModal;
        const backdrop = document.querySelector('.modal-backdrop');

        if (isModalOpen) {
            document.body.classList.add('modal-open');
            if (!backdrop) {
                const backdropElement = document.createElement('div');
                backdropElement.className = 'modal-backdrop fade show';
                document.body.appendChild(backdropElement);
            }
        } else {
            document.body.classList.remove('modal-open');
            if (backdrop) {
                backdrop.remove();
            }
        }
        return () => {
            document.body.classList.remove('modal-open');
            const existingBackdrop = document.querySelector('.modal-backdrop');
            if (existingBackdrop) {
                existingBackdrop.remove();
            }
        };
    }, [showAddModal, showManageModal]);

    const handleAddUser = (newUser) => {
        const userExists = usuarios.some(user => user.rut === newUser.rut);
        if (userExists) {
            Swal.fire('Usuario Existente', 'Este usuario ya ha sido agregado.', 'info');
            return;
        }
        setUsuarios([...usuarios, { ...newUser, modulos: [] }]);
    };

    const handleSaveModules = (updatedUser) => {
        setUsuarios(usuarios.map(u => u.rut === updatedUser.rut ? updatedUser : u));
    };

    const filteredUsuarios = usuarios.filter(usuario => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            usuario.nombre.toLowerCase().includes(searchTermLower) ||
            usuario.login.toLowerCase().includes(searchTermLower) ||
            String(usuario.rut).toLowerCase().includes(searchTermLower)
        );
    });

    return (
        <div className="container py-5 gestion-usuarios-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="gestion-usuarios-header">Gestión de Usuarios</h2>
                <button className="btn btn-primary gestion-usuarios-add-button" onClick={() => setShowAddModal(true)}>
                    <i className="bi bi-plus-lg me-2"></i>
                    Agregar Usuario
                </button>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control gestion-usuarios-search-input"
                    placeholder="Buscar por nombre, login o RUT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <UserTable usuarios={filteredUsuarios} onManageClick={(user) => {
                setSelectedUser(user);
                setShowManageModal(true);
            }} />

            <AddUserModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onUserAdded={handleAddUser}
            />

            {selectedUser && (
                <ManageUserModulesModal
                    show={showManageModal}
                    user={selectedUser}
                    onClose={() => {
                        setShowManageModal(false);
                        setSelectedUser(null);
                    }}
                    onSave={handleSaveModules}
                />
            )}
        </div>
    );
};

export default GestionUsuariosPage;
