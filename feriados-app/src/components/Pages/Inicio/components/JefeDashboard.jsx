import { useDashboardJefatura } from '../../../../hooks/useDashboardJefatura';
import AlertaSubrogacion from './JefeDashboard/AlertaSubrogacion';
import SolicitudesPendientesCard from './JefeDashboard/SolicitudesPendientesCard';
import ProximasAusenciasCard from './JefeDashboard/ProximasAusenciasCard';
import AusenciasHoyCard from './JefeDashboard/AusenciasHoyCard';
import LicenciasMedicasCard from './JefeDashboard/LicenciasMedicasCard';
import './JefeDashboard.css';

const JefeDashboard = () => {
    const { 
        solicitudesPendientes, 
        ausenciasProximas, 
        ausenciasHoy, 
        licenciasHoy,
        proximasLicencias,
        departamentosSubrogados, 
        cargando, 
        error 
    } = useDashboardJefatura();

    if (cargando) {
        return <div className="text-center py-4">Cargando datos del dashboard...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error al cargar los datos del dashboard.</div>;
    }

    return (
        <div className="col-12">
            <div className="jefe-dashboard-wrapper">
                <AlertaSubrogacion departamentosSubrogados={departamentosSubrogados} />
                <div className="row g-4">
                    <SolicitudesPendientesCard solicitudesPendientes={solicitudesPendientes} />
                    <ProximasAusenciasCard ausenciasProximas={ausenciasProximas} />
                    <AusenciasHoyCard ausenciasHoy={ausenciasHoy} />
                    <LicenciasMedicasCard licenciasHoy={licenciasHoy} proximasLicencias={proximasLicencias} />
                </div>
            </div>
        </div>
    );
};

export default JefeDashboard;
