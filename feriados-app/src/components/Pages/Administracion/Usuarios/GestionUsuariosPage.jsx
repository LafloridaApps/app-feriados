import UserTable from './components/UserTable';
import AddUserModal from './components/AddUserModal';
import ManageUserModulesModal from './components/ManageUserModulesModal';
import ControlesUsuarios from './components/ControlesUsuarios';
import { useGestionUsuarios } from './useGestionUsuarios';
import './GestionUsuariosPage.css';

const GestionUsuariosPage = () => {
    const {
        searchTerm, setSearchTerm, filteredUsuarios,
        showAddModal, setShowAddModal, showManageModal, selectedUser,
        handleAddUser, handleSaveModules, abrirGestionModulos, cerrarGestionModulos,
    } = useGestionUsuarios();

    return (
        <div className="container py-5 gestion-usuarios-container">
            <ControlesUsuarios searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                onAgregarUsuario={() => setShowAddModal(true)} />
            <UserTable usuarios={filteredUsuarios} onManageClick={abrirGestionModulos} />

            <AddUserModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onUserAdded={handleAddUser}
            />

            {selectedUser && (
                <ManageUserModulesModal
                    show={showManageModal}
                    user={selectedUser}
                    onClose={cerrarGestionModulos}
                    onSave={handleSaveModules}
                />
            )}
        </div>
    );
};

export default GestionUsuariosPage;
