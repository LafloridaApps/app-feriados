import WelcomeWidget from './components/WelcomeWidget';
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
    const { codDepto, rut } = funcionario || {};
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

                </div>
            )}
        </div>
    );
};

export default Inicio;