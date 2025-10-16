import { useContext } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { FirmaDigitalContext } from '../../../context/FirmaDigitalContext';

import WelcomeWidget from './components/WelcomeWidget';
import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeDashboard from './components/JefeDashboard';
import { useIsJefe } from '../../../hooks/useIsJefe';
import { useFuncionarioResumen } from '../../../hooks/useFuncionarioResumen'; // New import
import useWindowSize from '../../../hooks/useWindowSize'; // Importar el hook de tamaño de ventana
import InicioMobile from './InicioMobile'; // Importar el componente móvil
import FirmaDigitalCard from './components/FirmaDigitalCard';

const Inicio = () => {
    const { width } = useWindowSize(); // Obtener el ancho de la ventana
    const isMobile = width < 768; // Definir el breakpoint para móvil

    const funcionario = useContext(UsuarioContext);
    const { codDepto, rut } = funcionario || {};
    const { esJefe } = useIsJefe(codDepto, rut);
    const { resumenFunc } = useFuncionarioResumen(); // Get resumenFunc from the new hook
    const { tieneFirma } = useContext(FirmaDigitalContext);

    if (!funcionario) {
        return <p className="alert alert-info text-center mt-5" role='alert'>Cargando funcionario...</p>;
    }

    
    
   
    return (
        <div className="container mt-5">
            {isMobile ? (
                <InicioMobile
                    funcionario={funcionario}
                    esJefe={esJefe}
                    resumenFunc={resumenFunc}
                />
            ) : (
                <div className="row justify-content-center">
                    <div className="col-md-8 mb-4">
                        <WelcomeWidget funcionario={funcionario} />
                    </div>

                    <div className="col-md-8 mb-2">
                        <div className="row">
                            <SaldosWidget
                                saldoFeriado={resumenFunc?.saldoFeriado}
                                saldoAdministrativo={resumenFunc?.saldoAdministrativo}
                                idUltimaSolicitud={resumenFunc?.idUltimaSolicitud}
                                estadoUltimaSolicitud={resumenFunc?.estadoUltimaSolicitud}
                            />
                            <AccionesRapidasWidget />
                            <SolicitudesMesWidget solicitudes={resumenFunc?.solicitudMes} />
                        </div>
                    </div>

                    {esJefe && (
                        <div className="col-md-8 mb-4">
                            <JefeDashboard />
                        </div>
                    )}

                    {tieneFirma && (
                        <div className="col-md-8 mb-4">
                            <FirmaDigitalCard   />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inicio;