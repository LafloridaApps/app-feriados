import React from 'react';
import PropTypes from 'prop-types';
import TabsFeriados from "./TabsFeriados";
import './FeriadosPageMobile.css';

const FeriadosPageMobile = ({ resumen, detalle }) => {
    return (
        <div className="feriados-mobile-container">
            <div className="feriados-mobile-card mb-3">
                <div className="feriados-mobile-card-header">Resumen de Feriados</div>
                <div className="feriados-mobile-card-body">
                    <TabsFeriados resumen={resumen} detalle={detalle} />
                </div>
            </div>
        </div>
    );
};

FeriadosPageMobile.propTypes = {
    resumen: PropTypes.array.isRequired,
    detalle: PropTypes.array.isRequired,
};

export default FeriadosPageMobile;
