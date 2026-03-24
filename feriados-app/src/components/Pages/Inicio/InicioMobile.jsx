import React from 'react';
import PropTypes from 'prop-types';
import WelcomeWidget from './components/WelcomeWidget';
import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeDashboard from './components/JefeDashboard';
import FirmaDigitalCard from './components/FirmaDigitalCard';
import './InicioMobile.css';

const InicioMobile = ({ funcionario, esJefe, resumenFunc, tieneFirma }) => {
    return (
        <div className="inicio-mobile-container">
            <WelcomeWidget funcionario={funcionario} />

            <div>
                <h6 className="inicio-mobile-section-title">Mi Resumen</h6>
                <SaldosWidget
                    saldoFeriado={resumenFunc?.saldoFeriado}
                    saldoAdministrativo={resumenFunc?.saldoAdministrativo}
                    idUltimaSolicitud={resumenFunc?.idUltimaSolicitud}
                    estadoUltimaSolicitud={resumenFunc?.estadoUltimaSolicitud}
                />
            </div>

            <div>
                <h6 className="inicio-mobile-section-title">Acciones</h6>
                <AccionesRapidasWidget />
            </div>

            <div>
                <h6 className="inicio-mobile-section-title">Solicitudes del Mes</h6>
                <SolicitudesMesWidget solicitudes={resumenFunc?.solicitudMes} />
            </div>

            {esJefe && (
                <div className="mt-2">
                    <h6 className="inicio-mobile-section-title">Dashboard Jefatura</h6>
                    <JefeDashboard />
                </div>
            )}

            {tieneFirma && (
                <div className="mt-2">
                    <h6 className="inicio-mobile-section-title">Firma Digital</h6>
                    <FirmaDigitalCard />
                </div>
            )}
        </div>
    );
};

InicioMobile.propTypes = {
    funcionario: PropTypes.object,
    esJefe: PropTypes.bool,
    resumenFunc: PropTypes.shape({
        saldoFeriado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        saldoAdministrativo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        idUltimaSolicitud: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        estadoUltimaSolicitud: PropTypes.string,
        solicitudMes: PropTypes.array
    }),
    tieneFirma: PropTypes.bool
};

export default InicioMobile;
