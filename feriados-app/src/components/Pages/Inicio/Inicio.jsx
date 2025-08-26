
import { useContext, useEffect, useState } from 'react';
import { UsuarioContext } from '../../../context/UsuarioContext';
import { getResumenInicioByRut } from '../../../services/resumenFuncService';

import WelcomeWidget from './components/WelcomeWidget';
import SaldosWidget from './components/SaldosWidget';
import AccionesRapidasWidget from './components/AccionesRapidasWidget';
import SolicitudesMesWidget from './components/SolicitudesMesWidget';
import JefeWidgets from './components/JefeWidgets';

const Inicio = () => {
    const funcionario = useContext(UsuarioContext);
    const [resumenFunc, setResumenFunc] = useState(null);

    const getResumen = async () => {
        if (funcionario && funcionario.rut) {
            try {
                const response = await getResumenInicioByRut(funcionario.rut);
                setResumenFunc(response);
            } catch (error) {
                console.error("Error fetching resumen:", error);
                // Handle error appropriately, maybe show a message to the user
            }
        }
    };

    useEffect(() => {
        getResumen();
    }, [funcionario]);

    if (!funcionario) {
        return <p className="alert alert-info text-center mt-5" role='alert'>Cargando funcionario...</p>;
    }

    // Mock data for jefe widgets, as it was in the original component
    const solicitudesPendientes = 3; // Example
    const ausenciasEquipo = 2; // Example

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 mb-4">
                    <WelcomeWidget funcionario={funcionario} />
                </div>

                <div className="col-md-8">
                    <div className="row">
                        <JefeWidgets 
                            esJefe={funcionario.esJefe}
                            solicitudesPendientes={solicitudesPendientes} 
                            ausenciasEquipo={ausenciasEquipo} 
                        />
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
            </div>
        </div>
    );
};

export default Inicio;
