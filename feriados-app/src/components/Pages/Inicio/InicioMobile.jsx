import React from 'react';
import WelcomeWidget from './components/WelcomeWidget';
import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeDashboard from './components/JefeDashboard';
import './InicioMobile.css';

const InicioMobile = ({ funcionario, esJefe, resumenFunc }) => {
    return (
        <div className="inicio-mobile-container">
            <div className="inicio-mobile-welcome-widget">
                <WelcomeWidget funcionario={funcionario} />
            </div>

            <div className="inicio-mobile-widget-card">
                <div className="inicio-mobile-widget-card-header">Saldos</div>
                <SaldosWidget
                    saldoFeriado={resumenFunc?.saldoFeriado}
                    saldoAdministrativo={resumenFunc?.saldoAdministrativo}
                    idUltimaSolicitud={resumenFunc?.idUltimaSolicitud}
                    estadoUltimaSolicitud={resumenFunc?.estadoUltimaSolicitud}
                />
            </div>

            <div className="inicio-mobile-widget-card">
                <div className="inicio-mobile-widget-card-header">Acciones Rápidas</div>
                <AccionesRapidasWidget />
            </div>

            <div className="inicio-mobile-widget-card">
                <div className="inicio-mobile-widget-card-header">Solicitudes del Mes</div>
                <SolicitudesMesWidget solicitudes={resumenFunc?.solicitudMes} />
            </div>

            {esJefe && (
                <div className="inicio-mobile-widget-card">
                    <div className="inicio-mobile-widget-card-header">Dashboard de Jefe</div>
                    <JefeDashboard />
                </div>
            )}
        </div>
    );
};

export default InicioMobile;
