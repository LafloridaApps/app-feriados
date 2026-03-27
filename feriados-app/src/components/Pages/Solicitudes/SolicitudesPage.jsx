import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import FormularioSolicitud from "./FormularioSolicitud";
import ResumenPermisos from "./ResumenPermisos";
import { getAdministrativoByRutAnIdent } from "../../../services/adminsitrativoService";
import { getFeriadosByRutAndIdent } from "../../../services/feriadosService";
import { UsuarioContext } from '../../../context/UsuarioContext';
import useTamanoVentana from '../../../hooks/useTamanoVentana'; // Importar el hook de tamaño de ventana
import SolicitudesPageMobile from './SolicitudesPageMobile'; // Importar el componente móvil
import './SolicitudesPage.css'; // Importar el archivo CSS personalizado

const SolicitudesPage = () => {

    const { width } = useTamanoVentana(); // Obtener el ancho de la ventana
    const isMobile = width < 768; // Definir el breakpoint para móvil

    const funcionario = useContext(UsuarioContext);
    const [dataAdm, setDataAdm] = useState(null)
    const [dataFer, setDataFer] = useState(null)
    const { resumen: resumenAdm } = dataAdm || {};
    const { resumen: resumenFer } = dataFer || {};
    const { detalle: detalleAdm } = dataAdm || {};
    const { detalle: detalleFer } = dataFer || {};

    useEffect(() => {
        if (!funcionario) return;

        const anioActual = new Date().getFullYear();

        const fetchDataAdm = async () => {
            try {
                const response = await getAdministrativoByRutAnIdent(funcionario.rut, funcionario.ident);

                const resumenFiltrado = {
                    maximo: response?.maximo || 0,
                    usados: response?.usados || 0,
                    saldo: response?.saldo || 0,
                    anio: response?.anio || anioActual

                }

                const detalleFiltrado = response.detalle?.filter(item => {
                    const fecha = new Date(item.fechaInicio);
                    return !Number.isNaN(fecha.getTime()) && fecha.getFullYear() === anioActual;
                }) || [];


                setDataAdm({ ...response, resumen: resumenFiltrado, detalle: detalleFiltrado });
            } catch (error) {
                console.error('Error al obtener datos administrativos:', error);
            }
        };

        const fetchDataFeriados = async () => {
            try {
                const response = await getFeriadosByRutAndIdent(funcionario.rut, funcionario.ident);
                const resumenFiltrado = {
                    anio: response?.anio || anioActual,
                    dias_corresponden: response?.diasCorresponden || 0,
                    dias_acumulados: response?.diasAcumulados || 0,
                    dias_tomados: response?.diasTomados || 0,
                    dias_pendientes: response?.diasPendientes || 0,
                    total: response?.total || 0,
                    dias_perdidos: response?.diasPerdidos || 0

                }
                const detalleFiltrado = response.detalle?.filter(item => {
                    const fecha = new Date(item.fechaInicio);
                    return !Number.isNaN(fecha.getTime()) && fecha.getFullYear() === anioActual;
                }) || [];
                setDataFer({ ...response, resumen: resumenFiltrado, detalle: detalleFiltrado });
            } catch (error) {
                console.error('Error al obtener datos feriados:', error);
            }
        };
        fetchDataAdm();
        fetchDataFeriados();
    }, [funcionario]);



    if (!funcionario) return <p className="alert alert-info text-center mt-5" role='alert'>Cargando Información...</p>;

    return (
        isMobile ? (
            <SolicitudesPageMobile
                resumenAdm={resumenAdm}
                resumenFer={resumenFer}
                detalleAdm={detalleAdm}
                detalleFer={detalleFer}
            />
        ) : (
            <div className="container-fluid py-4 solicitudes-page-container">
                {/* Standardized Page Header - Premium Style */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                    <div className="mb-3 mb-md-0">
                        <h2 className="mb-1 text-primary fw-bold">
                            <i className="bi bi-calendar-plus me-2"></i>{' '}
                            Solicitudes de Permisos
                        </h2>
                        {funcionario?.nombre && (
                            <p className="text-muted mb-0">
                                Gestiona tus feriados y días administrativos para el periodo actual
                            </p>
                        )}
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12">
                        <div className="solicitudes-section-card">
                            <ResumenPermisos resumenAdm={resumenAdm} resumenFer={resumenFer} />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="solicitudes-section-card">
                            <FormularioSolicitud
                                resumenAdm={resumenAdm}
                                resumenFer={resumenFer}
                                detalleAdm={detalleAdm}
                                detalleFer={detalleFer}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default SolicitudesPage;

SolicitudesPage.propTypes = {
    funcionario: PropTypes.shape({
        rut: PropTypes.number.isRequired,
    }).isRequired,
};