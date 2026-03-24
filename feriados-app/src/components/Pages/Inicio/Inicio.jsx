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

import './Inicio.css';

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
        <div className="inicio-container container mt-5">
            {isMobile ? (
                <InicioMobile
                    funcionario={funcionario}
                    esJefe={esJefe}
                    resumenFunc={resumenFunc}
                    tieneFirma={tieneFirma}
                />
            ) : (
                <div className="row justify-content-center dashboard-row">
                    <div className="col-md-10 col-lg-8 mb-4">
                        <WelcomeWidget funcionario={funcionario} />
                    </div>

                    <div className="col-md-10 col-lg-8 mb-4">
                        <div className="row g-4">
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
                        <div className="col-md-10 col-lg-8 mb-4">
                            <h3 className="section-title">Dashboard de Jefatura</h3>
                            <JefeDashboard />
                        </div>
                    )}

                    {tieneFirma && (
                        <div className="col-md-10 col-lg-8 mb-4">
                            <h3 className="section-title">Firma Digital</h3>
                            <FirmaDigitalCard   />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inicio;