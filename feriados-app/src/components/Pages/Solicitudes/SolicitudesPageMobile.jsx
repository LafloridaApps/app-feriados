import React from 'react';
import ResumenPermisos from "./ResumenPermisos";
import FormularioSolicitud from "./FormularioSolicitud";
import './SolicitudesPageMobile.css';

const SolicitudesPageMobile = ({ resumenAdm, resumenFer, detalleAdm, detalleFer }) => {
    return (
        <div className="solicitudes-mobile-container">
            <div className="solicitudes-mobile-card mb-3">
                <div className="solicitudes-mobile-card-header">Resumen de Permisos  </div>
                <div className="solicitudes-mobile-card-body">
                    <ResumenPermisos resumenAdm={resumenAdm} resumenFer={resumenFer} />
                </div>
            </div>

            <div className="solicitudes-mobile-card">
                <div className="solicitudes-mobile-card-header">Formulario de Solicitud</div>
                <div className="solicitudes-mobile-card-body">
                    <FormularioSolicitud
                        resumenAdm={resumenAdm}
                        resumenFer={resumenFer}
                        detalleAdm={detalleAdm}
                        detalleFer={detalleFer}
                    />
                </div>
            </div>
        </div>
    );
};

export default SolicitudesPageMobile;
