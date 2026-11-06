import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { listarUsuarios } from '../../../../services/usuarioService';

export const useGestionUsuarios = () => {
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
                void Swal.fire('Error', 'No se pudo cargar la lista de usuarios.', 'error');
            }
        }
        void getUsuario();
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
            void Swal.fire('Usuario Existente', 'Este usuario ya ha sido agregado.', 'info');
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

    const abrirGestionModulos = (user) => {
        setSelectedUser(user);
        setShowManageModal(true);
    };

    const cerrarGestionModulos = () => {
        setShowManageModal(false);
        setSelectedUser(null);
    };

    return {
        searchTerm, setSearchTerm, filteredUsuarios,
        showAddModal, setShowAddModal, showManageModal, selectedUser,
        handleAddUser, handleSaveModules, abrirGestionModulos, cerrarGestionModulos,
    };
};
