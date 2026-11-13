import { useContext, useEffect, useState } from 'react';
import { UsuarioContext } from '../../../../context/UsuarioContext';
import { getPermisosByUsuario } from '../../../../services/usuarioService';

export const usePermisoCeroPapel = () => {
    const funcionario = useContext(UsuarioContext);
    const rut = funcionario?.rut;
    const [permiso, setPermiso] = useState(null);

    useEffect(() => {
        let vigente = true;
        if (rut) {
            getPermisosByUsuario(rut)
                .then(usuario => {
                    if (vigente) {
                        setPermiso({
                            rut,
                            autorizado: usuario?.modulos?.some(modulo => modulo.nombre === 'CONFIGURACION CERO PAPEL') ?? false,
                        });
                    }
                })
                .catch(() => { if (vigente) setPermiso({ rut, autorizado: false }); });
        }
        return () => { vigente = false; };
    }, [rut]);

    return Boolean(rut && permiso?.rut === rut && permiso.autorizado);
};
