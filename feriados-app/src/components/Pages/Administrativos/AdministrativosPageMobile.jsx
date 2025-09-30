import React from 'react';
import TabsAdministrativos from "./TabsAdministrativos";
import './AdministrativosPageMobile.css';

const AdministrativosPageMobile = ({ resumen, detalle }) => {
    return (
        <div className="administrativos-mobile-container">
            <div className="administrativos-mobile-card mb-3">
                <div className="administrativos-mobile-card-header">Resumen de Permisos Administrativos</div>
                <div className="administrativos-mobile-card-body">
                    <TabsAdministrativos resumen={resumen} detalle={detalle} />
                </div>
            </div>
        </div>
    );
};

export default AdministrativosPageMobile;
