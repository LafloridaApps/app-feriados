import WelcomeWidget from './components/WelcomeWidget';
import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeDashboard from './components/JefeDashboard';
import { useEsJefe } from '../../../hooks/useEsJefe';
import { useUsuario } from '../../../hooks/useUsuario';
import useTamanoVentana from '../../../hooks/useTamanoVentana';
import { useFirmaDigital } from '../../../hooks/useFirmaDigital';
import InicioMobile from './InicioMobile';
import FirmaDigitalCard from './components/FirmaDigitalCard';

import './Inicio.css';

const Inicio = () => {
    const { ancho } = useTamanoVentana();
    const esMovil = ancho < 768;

    const funcionario = useUsuario();
    const { codDepto, rut } = funcionario || {};
    const { esJefe } = useEsJefe(codDepto, rut);
    const { tieneFirma } = useFirmaDigital();

    if (!funcionario) {
        return <p className="alert alert-info text-center mt-5" role='alert'>Cargando funcionario...</p>;
    }

    return (
        <div className="inicio-container container mt-5">
            {esMovil ? (
                <InicioMobile />
            ) : (
                <div className="row justify-content-center dashboard-row">
                    <div className="col-md-10 col-lg-8 mb-4">
                        <WelcomeWidget />
                    </div>

                    <div className="col-md-10 col-lg-8 mb-4">
                        <div className="row g-4">
                            <SaldosWidget />
                            <AccionesRapidasWidget />
                            <SolicitudesMesWidget />
                        </div>
                    </div>

                    {esJefe && (
                        <div className="col-md-10 col-lg-8 mb-4">
                            <h3 className="section-title">Dashboard de Jefatura</h3>
                            <JefeDashboard />
                        </div>
                    )}

                    {tieneFirma && (
                        <div className="col-md-10 col-lg-8 mb-4">
                            <h3 className="section-title">Firma Digital</h3>
                            <FirmaDigitalCard />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inicio;