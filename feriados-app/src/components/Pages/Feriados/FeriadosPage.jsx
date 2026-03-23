import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from "react";
import { getFeriadosByRutAndIdent } from "../../../services/feriadosService";
import TabsFeriados from "./TabsFeriados";
import { UsuarioContext } from '../../../context/UsuarioContext';
import useWindowSize from '../../../hooks/useWindowSize'; // Importar el hook de tamaño de ventana
import FeriadosPageMobile from './FeriadosPageMobile'; // Importar el componente móvil
import './FeriadosPage.css'; // Importar el archivo CSS personalizado

const FeriadosPage = () => {

    const { width } = useWindowSize(); // Obtener el ancho de la ventana
    const isMobile = width < 768; // Definir el breakpoint para móvil

    const funcionario = useContext(UsuarioContext);

    const [data, setData] = useState([]);

    useEffect(() => {
        if (funcionario) {
            const fetchPermisos = async () => {
                try {
                    const response = await getFeriadosByRutAndIdent(funcionario.rut, funcionario.ident);
                    setData(response);
                } catch (error) {
                    console.error("Error al obtener funcionario:", error);
                }
            };
            fetchPermisos();
        }
    }, [funcionario]);

    const resumen = {
        anio: data.anio || new Date().getFullYear(),
        total: data.total || 0,
        diasCorresponden: data.diasCorresponden || 0,
        diasPendientes: data.diasPendientes || 0,
        diasAcumulados: data.diasAcumulados || 0,
        diasTomados: data.diasTomados || 0,
    }
    const detalle = data.detalle || [];


    if (!funcionario) return <p className="alert alert-info text-center mt-5" role='alert'>Cargando Información...</p>;

    return (
        isMobile ? (
            <FeriadosPageMobile resumen={resumen} detalle={detalle} />
        ) : (
            <div className="container-fluid py-4 feriados-page-container">
                {/* Standardized Page Header - Premium Style */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                    <div className="mb-3 mb-md-0">
                        <h2 className="mb-1 text-primary fw-bold">
                            <i className="bi bi-calendar-check me-2"></i>{' '}
                            Feriados Legales
                        </h2>
                        {funcionario?.nombre && (
                            <p className="text-muted mb-0">
                                Consulta el estado de tus vacaciones y días acumulados
                            </p>
                        )}
                    </div>
                </div>

                <div className="feriados-section-card">
                    <TabsFeriados resumen={resumen} detalle={detalle} />
                </div>
            </div>
        )
    );
};

export default FeriadosPage;

FeriadosPage.propTypes = {
    funcionario: PropTypes.shape({
        rut: PropTypes.number.isRequired,
    }).isRequired,
};
