import { PropTypes } from 'prop-types';
import { useContext, useEffect, useState } from "react";
import FormularioSolicitud from "./FormularioSolicitud";
import ResumenPermisos from "./ResumenPermisos";
import { getAdministrativoByRutAnIdent } from "../../../services/adminsitrativoService";
import { getFeriadosByRutAndIdent } from "../../../services/feriadosService";
import { UsuarioContext } from '../../../context/UsuarioContext';
import useWindowSize from '../../../hooks/useWindowSize'; // Importar el hook de tamaño de ventana
import SolicitudesPageMobile from './SolicitudesPageMobile'; // Importar el componente móvil
import './SolicitudesPage.css'; // Importar el archivo CSS personalizado

const SolicitudesPage = () => {

    const { width } = useWindowSize(); // Obtener el ancho de la ventana
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
                    return !isNaN(fecha) && fecha.getFullYear() === anioActual;
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
                    return !isNaN(fecha) && fecha.getFullYear() === anioActual;
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
            <div className="container py-4 solicitudes-page-container">
                <h2 className="mb-4 text-primary text-center solicitudes-page-header">Solicitudes de Permisos</h2>
                <div className="row g-4">
                    <div className="col-md-12">
                        <div className="solicitudes-section-card">
                            <ResumenPermisos resumenAdm={resumenAdm} resumenFer={resumenFer} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
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