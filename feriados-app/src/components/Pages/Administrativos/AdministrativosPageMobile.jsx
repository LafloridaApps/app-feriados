import React from 'react';
import TabsAdministrativos from "./TabsAdministrativos";
import './AdministrativosPageMobile.css';
import PropTypes from 'prop-types';

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

AdministrativosPageMobile.propTypes = {
    resumen: PropTypes.shape({
        anio: PropTypes.number.isRequired, 
    }).isRequired,
    detalle: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
    })).isRequired,
};

export default AdministrativosPageMobile;
