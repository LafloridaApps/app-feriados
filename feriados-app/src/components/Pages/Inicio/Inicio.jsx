
import { useContext } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';

import WelcomeWidget from './components/WelcomeWidget';
import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeDashboard from './components/JefeDashboard';
import { useIsJefe } from '../../../hooks/useIsJefe';
import { useJefeDashboard } from '../../../hooks/useJefeDashboard';

const Inicio = () => {
    const funcionario = useContext(UsuarioContext);
    const { codDepto, rut } = funcionario || {};
    const { esJefe } = useIsJefe(codDepto, rut);
    const { resumenFunc } = useJefeDashboard();

    if (!funcionario) {
        return <p className="alert alert-info text-center mt-5" role='alert'>Cargando funcionario...</p>;
    }


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 mb-4">
                    <WelcomeWidget funcionario={funcionario} />
                </div>

                <div className="col-md-8">
                    <div className="row">
                        <SaldosWidget
                            saldoFeriado={resumenFunc?.saldoFeriado}
                            saldoAdministrativo={resumenFunc?.saldoAdministrativo}
                            idUltimaSolicitud={resumenFunc?.idUltimaSolicitud}
                            estadoUltimaSolicitud={resumenFunc?.estadoUltimaSolicitud}
                        />
                        <AccionesRapidasWidget />
                        <SolicitudesMesWidget solicitudes={resumenFunc?.solicitudMes} />
                        {esJefe && <JefeDashboard />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inicio;
