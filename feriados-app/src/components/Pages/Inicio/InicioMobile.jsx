import React from 'react';
import { useUsuario } from '../../../hooks/useUsuario';
import { useEsJefe } from '../../../hooks/useEsJefe';
import WelcomeWidget from './components/WelcomeWidget';
import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeDashboard from './components/JefeDashboard';
import './InicioMobile.css';

const InicioMobile = () => {
    const funcionario = useUsuario();
    const { codDepto, rut } = funcionario || {};
    const { esJefe } = useEsJefe(codDepto, rut);

    return (
        <div className="inicio-mobile-container">
            <WelcomeWidget />

            <div>
                <h6 className="inicio-mobile-section-title">Mi Resumen</h6>
                <SaldosWidget />
            </div>

            <div>
                <h6 className="inicio-mobile-section-title">Acciones</h6>
                <AccionesRapidasWidget />
            </div>

            <div>
                <h6 className="inicio-mobile-section-title">Solicitudes del Mes</h6>
                <SolicitudesMesWidget />
            </div>

            {esJefe && (
                <div className="mt-2">
                    <h6 className="inicio-mobile-section-title">Dashboard Jefatura</h6>
                    <JefeDashboard />
                </div>
            )}


        </div>
    );
};

export default InicioMobile;
