import FiltrosInformes from './InformesTab/FiltrosInformes';
import ResumenInformes from './InformesTab/ResumenInformes';
import SolicitudesPorMes from './InformesTab/SolicitudesPorMes';
import SolicitudesPorDepartamento from './InformesTab/SolicitudesPorDepartamento';
import { useInformesTab } from './InformesTab/useInformesTab';

const InformesTab = () => {
    const {
        filtroDepto, setFiltroDepto, filtroAnio, setFiltroAnio,
        informesData, loading, error,
    } = useInformesTab();

    if (loading) {
        return <div className="text-center py-5 text-muted"><output className="spinner-border spinner-border-sm me-2"></output>Cargando informes...</div>;
    }

    if (error) {
        return <div className="alert alert-danger m-3">{error}</div>;
    }

    return (
        <div className="py-3">
            <FiltrosInformes departamentos={informesData.departamentosDropdown}
                filtroDepto={filtroDepto} setFiltroDepto={setFiltroDepto}
                filtroAnio={filtroAnio} setFiltroAnio={setFiltroAnio} />
            <ResumenInformes kpis={informesData.kpis} />
            <div className="row g-4">
                <SolicitudesPorMes porMes={informesData.porMes} />
                <SolicitudesPorDepartamento porDepartamento={informesData.porDepartamento} />
            </div>
        </div>
    );
};

export default InformesTab;
