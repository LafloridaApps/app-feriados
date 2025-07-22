import { PropTypes } from 'prop-types';
import { useState, useEffect, useContext } from "react";
import { getFeriadosByRutAndIdent } from "../../../services/feriadosService";
import TabsFeridos from "./TabsFeridos ";
import { UsuarioContext } from '../../../context/UsuarioContext';

const FeridosPage = () => {

    const funcionario = useContext(UsuarioContext);

    const [data, setData] = useState([]);

    useEffect(() => {
        if (funcionario) {
            const fetchPermisos = async () => {
                try {
                    const response = await getFeriadosByRutAndIdent(funcionario.rut,funcionario.ident);
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
        <div className="container py-5">
            <h2 className="text-center mb-4">Feridos Legales</h2>
            <TabsFeridos resumen={resumen} detalle={detalle} />
        </div>
    );
};

export default FeridosPage;

FeridosPage.propTypes = {
    funcionario: PropTypes.shape({
        rut: PropTypes.number.isRequired,
    }).isRequired,
};
