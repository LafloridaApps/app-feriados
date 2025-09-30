import { PropTypes } from 'prop-types';
import { useContext, useEffect, useState } from "react";
import { getAdministrativoByRutAnIdent } from "../../../services/adminsitrativoService";
import TabsAdministrativos from "./TabsAdministrativos";
import { UsuarioContext } from '../../../context/UsuarioContext';
import useWindowSize from '../../../hooks/useWindowSize'; // Importar el hook de tamaño de ventana
import AdministrativosPageMobile from './AdministrativosPageMobile'; // Importar el componente móvil
import './AdministrativosPage.css'; // Importar el archivo CSS personalizado

const AdministrativosPage = () => {
    const { width } = useWindowSize(); // Obtener el ancho de la ventana
    const isMobile = width < 768; // Definir el breakpoint para móvil

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
        isMobile ? (
            <AdministrativosPageMobile resumen={resumen} detalle={detalle} />
        ) : (
            <div className="container py-5 administrativos-page-container">
                <h1 className="mb-4 border-bottom pb-2 text-center administrativos-page-header">Permisos Administrativos</h1>
                <TabsAdministrativos resumen={resumen} detalle={detalle} />
            </div>
        )
    );
}

export default AdministrativosPage;

AdministrativosPage.propTypes = {
    funcionario: PropTypes.shape({
        rut: PropTypes.number.isRequired,
    }).isRequired,
};