import React from 'react';
import PropTypes from 'prop-types';
import ResumenPermisos from "./ResumenPermisos";
import FormularioSolicitud from "./FormularioSolicitud";
import './PaginaSolicitudesMovil.css';

const PaginaSolicitudesMovil = ({ resumenAdministrativo, resumenFeriados, detalleAdministrativo, detalleFeriados }) => {
    return (
        <div className="solicitudes-mobile-container">
            <div className="solicitudes-mobile-card mb-3">
                <div className="solicitudes-mobile-card-header">Resumen de Permisos  </div>
                <div className="solicitudes-mobile-card-body">
                    <ResumenPermisos 
                        resumenAdministrativo={resumenAdministrativo} 
                        resumenFeriados={resumenFeriados} 
                    />
                </div>
            </div>

            <div className="solicitudes-mobile-card">
                <div className="solicitudes-mobile-card-header">Formulario de Solicitud</div>
                <div className="solicitudes-mobile-card-body">
                    <FormularioSolicitud
                        resumenAdministrativo={resumenAdministrativo}
                        resumenFeriados={resumenFeriados}
                        detalleAdministrativo={detalleAdministrativo}
                        detalleFeriados={detalleFeriados}
                    />
                </div>
            </div>
        </div>
    );
};

PaginaSolicitudesMovil.propTypes = {
    resumenAdministrativo: PropTypes.object,
    resumenFeriados: PropTypes.object,
    detalleAdministrativo: PropTypes.array,
    detalleFeriados: PropTypes.array,
};


export default PaginaSolicitudesMovil;
