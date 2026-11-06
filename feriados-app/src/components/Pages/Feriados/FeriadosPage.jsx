import FeriadosPageMobile from './FeriadosPageMobile';
import VistaFeriados from './FeriadosPage/VistaFeriados';
import { useFeriadosPage } from './FeriadosPage/useFeriadosPage';
import './FeriadosPage.css';

const FeriadosPage = () => {
    const { funcionario, isMobile, resumen, detalle } = useFeriadosPage();

    if (!funcionario) return <output className="alert alert-info text-center mt-5 d-block">Cargando Información...</output>;

    return isMobile ? (
        <FeriadosPageMobile resumen={resumen} detalle={detalle} />
    ) : (
        <VistaFeriados funcionario={funcionario} resumen={resumen} detalle={detalle} />
    );
};

export default FeriadosPage;
