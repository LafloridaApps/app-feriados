import React from 'react';
import { useUsuario } from '../../../hooks/useUsuario';
import { useEsJefe } from '../../../hooks/useEsJefe';
import { useFirmaDigital } from '../../../hooks/useFirmaDigital';
import WelcomeWidget from './components/WelcomeWidget';
import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeDashboard from './components/JefeDashboard';
import FirmaDigitalCard from './components/FirmaDigitalCard';
import './InicioMobile.css';

const InicioMobile = () => {
    const funcionario = useUsuario();
    const { codDepto, rut } = funcionario || {};
    const { esJefe } = useEsJefe(codDepto, rut);
    const { tieneFirma } = useFirmaDigital();

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

            {tieneFirma && (
                <div className="mt-2">
                    <h6 className="inicio-mobile-section-title">Firma Digital</h6>
                    <FirmaDigitalCard />
                </div>
            )}
        </div>
    );
};

export default InicioMobile;
