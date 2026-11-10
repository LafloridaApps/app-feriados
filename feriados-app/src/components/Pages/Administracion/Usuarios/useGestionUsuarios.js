import { useState } from 'react';
import { listarUsuariosPagina, guardarUsuario, getPermisosByUsuario } from '../../../../services/usuarioService';
import { usePaginaAdministracion } from '../hooks/usePaginaAdministracion';

export const useGestionUsuarios = () => {
    const listado = usePaginaAdministracion(listarUsuariosPagina, 'No se pudo cargar la lista de usuarios.');
    const { items: usuarios, recargar } = listado;
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const handleAddUser = async newUser => {
        const rut = String(newUser.rut);
        const existente = await getPermisosByUsuario(rut);
        if (existente) throw new Error('Este usuario ya está registrado.');
        await guardarUsuario({ rut, modulos: [] });
        recargar();
    };
    return {
        ...listado, searchTerm: listado.busqueda, setSearchTerm: listado.setBusqueda, filteredUsuarios: usuarios, usuarios,
        showAddModal, setShowAddModal, selectedUser,
        handleAddUser, handleSaveModules: recargar,
        abrirGestionModulos: setSelectedUser, cerrarGestionModulos: () => setSelectedUser(null),
    };
};
