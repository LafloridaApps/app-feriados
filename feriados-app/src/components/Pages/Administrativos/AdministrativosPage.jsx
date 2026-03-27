import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import { getAdministrativoByRutAnIdent } from "../../../services/adminsitrativoService";
import TabsAdministrativos from "./TabsAdministrativos";
import { UsuarioContext } from '../../../context/UsuarioContext';
import useTamanoVentana from '../../../hooks/useTamanoVentana'; // Importar el hook de tamaño de ventana
import AdministrativosPageMobile from './AdministrativosPageMobile'; // Importar el componente móvil
import './AdministrativosPage.css'; // Importar el archivo CSS personalizado

const AdministrativosPage = () => {
    const { width } = useTamanoVentana(); // Obtener el ancho de la ventana
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
            <div className="container-fluid py-4 administrativos-page-container">
                {/* Standardized Page Header - Premium Style */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                    <div className="mb-3 mb-md-0">
                        <h2 className="mb-1 text-primary fw-bold">
                            <i className="bi bi-person-badge-fill me-2"></i>{' '}
                            Permisos Administrativos
                        </h2>
                        {funcionario?.nombre && (
                            <p className="text-muted mb-0">
                                Gestiona tus días administrativos y revisa tu historial
                            </p>
                        )}
                    </div>
                </div>

                <div className="administrativos-section-card">
                    <TabsAdministrativos resumen={resumen} detalle={detalle} />
                </div>
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