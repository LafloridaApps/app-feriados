import { useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';

export const useUsuario = () => {
    const usuario = useContext(UsuarioContext);
    return usuario;
};
