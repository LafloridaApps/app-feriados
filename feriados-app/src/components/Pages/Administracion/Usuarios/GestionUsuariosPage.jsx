import PaginacionAdministracion from '../components/PaginacionAdministracion';
import UserTable from './components/UserTable';
import AddUserModal from './components/AddUserModal';
import ManageUserModulesModal from './components/ManageUserModulesModal';
import ControlesUsuarios from './components/ControlesUsuarios';
import AdministracionLayout from '../components/AdministracionLayout';
import EstadoListado from '../components/EstadoListado';
import { useGestionUsuarios } from './useGestionUsuarios';
import './GestionUsuariosPage.css';

export default function GestionUsuariosPage() {
    const gestion = useGestionUsuarios();
    return <AdministracionLayout titulo="Usuarios" descripcion="Administre los usuarios y los módulos a los que pueden acceder.">
        <div className="admin-panel">
            <ControlesUsuarios searchTerm={gestion.searchTerm} setSearchTerm={gestion.setSearchTerm} onAgregarUsuario={() => gestion.setShowAddModal(true)} disabled={gestion.loading || Boolean(gestion.error)} />
            <EstadoListado loading={gestion.loading} error={gestion.error} onRetry={gestion.recargar} />
            {!gestion.loading && !gestion.error && (
                <UserTable usuarios={gestion.filteredUsuarios} onManageClick={gestion.abrirGestionModulos} />
            )}
            <PaginacionAdministracion {...gestion} />
        </div>
        {gestion.showAddModal && <AddUserModal onClose={() => gestion.setShowAddModal(false)} onUserAdded={gestion.handleAddUser} />}
        {gestion.selectedUser && <ManageUserModulesModal key={gestion.selectedUser.rut} user={gestion.selectedUser} onClose={gestion.cerrarGestionModulos} onSave={gestion.handleSaveModules} />}
    </AdministracionLayout>;
}
