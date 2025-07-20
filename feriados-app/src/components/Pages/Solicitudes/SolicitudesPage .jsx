import { PropTypes } from 'prop-types';
import { useContext, useEffect, useState } from "react";
import FormularioSolicitud from "./FormularioSolicitud";
import ResumenPermisos from "./ResumenPermisos";
import { getAdministrativoByRut } from "../../../services/adminsitrativoService";
import { getFeriadosByRut } from "../../../services/feriadosService";
import { UsuarioContext } from '../../../context/UsuarioContext';


const SolicitudesPage = () => {


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
                const response = await getAdministrativoByRut(funcionario.rut, funcionario.ident);

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
                const response = await getFeriadosByRut(funcionario.rut, funcionario.ident);
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
        <div className="container py-4">
            <h2 className="mb-4 text-primary text-center">Solicitudes de Permisos</h2>
            <div className="row g-4">
                <div className="col-md-12">
                    <ResumenPermisos resumenAdm={resumenAdm} resumenFer={resumenFer} />
                </div>
                <div className="row">
                    <div className="col-md-12">
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
    );
};

export default SolicitudesPage;

SolicitudesPage.propTypes = {
    funcionario: PropTypes.shape({
        rut: PropTypes.number.isRequired,
    }).isRequired,
};