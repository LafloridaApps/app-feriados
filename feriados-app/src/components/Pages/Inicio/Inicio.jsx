import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeDashboard from './components/JefeDashboard';
import { useEsJefe } from '../../../hooks/useEsJefe';
import { useUsuario } from '../../../hooks/useUsuario';
import useTamanoVentana from '../../../hooks/useTamanoVentana';
import InicioMobile from './InicioMobile';

import './Inicio.css';

const Inicio = () => {
    const { ancho } = useTamanoVentana();
    const esMovil = ancho < 768;

    const funcionario = useUsuario();
    const { codDepto, rut, departamento, nombreJefe, escalafon } = funcionario || {};
    const { esJefe } = useEsJefe(codDepto, rut);

    if (!funcionario) {
        return <output className="alert alert-info text-center mt-5 d-block">Cargando funcionario...</output>;
    }

    return (
        <div className="inicio-container container mt-5">
            {esMovil ? (
                <InicioMobile />
            ) : (
                <div className="row justify-content-center dashboard-row">
                    <div className="col-md-12 col-lg-10 mb-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                            <div>
                                <p className="text-muted mb-1 fs-5">{departamento}</p>
                                {escalafon !== 'ALCALDE' && (
                                    <p className="text-muted mb-0 small">
                                        Tu jefatura directa es <span className="fw-bold">{nombreJefe}</span>.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 col-lg-10 mb-4">
                        <h3 className="section-title mb-3">Mi Panel Principal</h3>
                        <div className="d-flex align-items-center bg-primary bg-opacity-10 p-3 rounded-3 mb-4 border border-primary border-opacity-25 shadow-sm">
                            <i className="bi bi-info-circle-fill text-primary fs-4 me-3"></i>
                            <p className="text-dark mb-0" style={{ fontSize: '0.95rem' }}>
                                En esta sección encontrarás un resumen rápido de tus saldos, accesos directos a trámites y el estado de tus solicitudes del mes.
                            </p>
                        </div>
                        <div className="row g-4">
                            <SaldosWidget />
                            <AccionesRapidasWidget />
                            <SolicitudesMesWidget />
                        </div>
                    </div>

                    {esJefe && (
                        <div className="col-md-12 col-lg-10 mb-4">
                            <h3 className="section-title mb-3">Dashboard de Jefatura</h3>
                            <div className="d-flex align-items-center bg-warning bg-opacity-10 p-3 rounded-3 mb-4 border border-warning border-opacity-25 shadow-sm">
                                <i className="bi bi-lightbulb-fill text-warning fs-4 me-3"></i>
                                <p className="text-dark mb-0" style={{ fontSize: '0.95rem' }}>
                                    Aquí podrás gestionar las solicitudes de tu equipo a cargo y monitorear el calendario de ausencias para una mejor planificación.
                                </p>
                            </div>
                            <JefeDashboard />
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default Inicio;