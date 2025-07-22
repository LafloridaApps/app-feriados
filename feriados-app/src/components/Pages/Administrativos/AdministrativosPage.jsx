import { PropTypes } from 'prop-types';
import { useContext, useEffect, useState } from "react";
import { getAdministrativoByRutAnIdent } from "../../../services/adminsitrativoService";
import TabsAdministrativos from "./TabsAdministrativos";
import { UsuarioContext } from '../../../context/UsuarioContext';

const AdministrativosPage = () => {
    const funcionario = useContext(UsuarioContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (funcionario) {
            const fetchPermisos = async () => {
                try {
                    const response = await getAdministrativoByRutAnIdent(funcionario.rut, funcionario.ident);
                    setData(response);
                } catch (error) {
                    console.error("Error al obtener funcionario:", error);
                }
            };
            fetchPermisos();
        }
    }, [funcionario]);

    if (!funcionario) return <p className="alert alert-info text-center mt-5" role='alert'>Cargando Información...</p>;

    const resumen = {
        anio: data.anio || new Date().getFullYear(),
        maximo: data.maximo || 0,
        usados: data.usados || 0,
        saldo: data.saldo || 0,
    }
    const detalle = data.detalle || [];


    return (
        <div className="container py-5">
            <h1 className="mb-4 border-bottom pb-2 text-center">Permisos Administrativos</h1>
            <TabsAdministrativos resumen={resumen} detalle={detalle} />
        </div>
    );
}

export default AdministrativosPage;

AdministrativosPage.propTypes = {
    funcionario: PropTypes.shape({
        rut: PropTypes.number.isRequired,
    }).isRequired,
};