import { useContext, useEffect, useState, useCallback } from "react";
import { getAdministrativoByRutAnIdent } from "../services/adminsitrativoService";
import { getFeriadosByRutAndIdent } from "../services/feriadosService";
import { cargarSaldosSolicitud } from "../services/saldosSolicitud";
import { UsuarioContext } from '../context/UsuarioContext';
import useTamanoVentana from './useTamanoVentana';

// La solicitud normal y la de terceros comparten las consultas y los saldos de su funcionario.
export const useSolicitudes = () => {
    const { width: ancho } = useTamanoVentana();
    const funcionario = useContext(UsuarioContext);
    const rut = funcionario?.rut;
    const ident = funcionario?.ident;
    const [version, setVersion] = useState(0);
    const [resultado, setResultado] = useState(null);
    const clave = rut ? `${rut}:${ident}:${version}` : null;
    const recargarSaldos = useCallback(() => setVersion(anterior => anterior + 1), []);

    useEffect(() => {
        let vigente = true;
        if (clave) {
            cargarSaldosSolicitud({ rut, ident }, {
                consultarAdministrativos: getAdministrativoByRutAnIdent,
                consultarFeriados: getFeriadosByRutAndIdent
            }, new Date().getFullYear()).then(datos => {
                if (vigente) setResultado({ clave, ...datos });
            }).catch(() => {
                if (vigente) setResultado({ clave, datosAdministrativos: null, datosFeriados: null,
                    errores: ['No fue posible cargar los saldos del funcionario seleccionado.'] });
            });
        }
        return () => { vigente = false; };
    }, [clave, rut, ident]);

    // Nunca presentar saldos de otra persona mientras se consulta un nuevo RUT.
    const datos = clave && resultado?.clave === clave ? resultado : null;
    const datosAdministrativos = datos?.datosAdministrativos;
    const datosFeriados = datos?.datosFeriados;
    return {
        funcionario, datosAdministrativos, datosFeriados,
        esMovil: ancho < 768,
        cargando: Boolean(clave) && !datos,
        erroresSaldos: datos?.errores ?? [],
        saldosCargados: Boolean(datosAdministrativos && datosFeriados),
        recargarSaldos,
        resumenAdministrativo: datosAdministrativos?.resumen,
        resumenFeriados: datosFeriados?.resumen,
        detalleAdministrativo: datosAdministrativos?.detalle,
        detalleFeriados: datosFeriados?.detalle
    };
};
