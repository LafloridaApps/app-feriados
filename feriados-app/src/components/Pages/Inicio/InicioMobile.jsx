import React from 'react';
import { useUsuario } from '../../../hooks/useUsuario';
import { useEsJefe } from '../../../hooks/useEsJefe';
import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeDashboard from './components/JefeDashboard';
import './InicioMobile.css';

const InicioMobile = () => {
    const funcionario = useUsuario();
    const { codDepto, rut, nombre, departamento, escalafon, nombreJefe } = funcionario || {};
    const { esJefe } = useEsJefe(codDepto, rut);

    return (
        <div className="inicio-mobile-container">
            <div className="bg-white p-4 rounded shadow-sm border-start border-4 border-primary mb-4">
                <h4 className="mb-1 text-primary fw-bold">¡Hola, {nombre}!</h4>
                <p className="text-muted mb-2 small">{departamento}</p>
                {escalafon !== 'ALCALDE' && (
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                        Jefatura: <span className="fw-bold">{nombreJefe}</span>
                    </p>
                )}
            </div>

            <div className="bg-primary bg-opacity-10 p-3 rounded-3 mb-4 border border-primary border-opacity-25">
                <div className="d-flex align-items-start">
                    <i className="bi bi-info-circle-fill text-primary me-2 mt-1"></i>
                    <p className="text-dark mb-0 small">
                        En esta sección encontrarás un resumen rápido de tus saldos, accesos directos y tus solicitudes recientes.
                    </p>
                </div>
            </div>

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
                <div className="mt-4 pt-2 border-top">
                    <h6 className="inicio-mobile-section-title text-primary">Dashboard Jefatura</h6>
                    <div className="bg-warning bg-opacity-10 p-3 rounded-3 mb-3 border border-warning border-opacity-25">
                        <div className="d-flex align-items-start">
                            <i className="bi bi-lightbulb-fill text-warning me-2 mt-1"></i>
                            <p className="text-dark mb-0 small">
                                Gestiona las solicitudes de tu equipo a cargo y revisa sus fechas en el calendario de ausencias.
                            </p>
                        </div>
                    </div>
                    <JefeDashboard />
                </div>
            )}


        </div>
    );
};

export default InicioMobile;
