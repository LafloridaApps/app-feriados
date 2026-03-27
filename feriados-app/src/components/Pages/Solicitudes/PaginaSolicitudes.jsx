import PropTypes from 'prop-types';
import FormularioSolicitud from "./FormularioSolicitud";
import ResumenPermisos from "./ResumenPermisos";
import { useSolicitudes } from '../../../hooks/useSolicitudes';
import PaginaSolicitudesMovil from './PaginaSolicitudesMovil';
import './PaginaSolicitudes.css';

const PaginaSolicitudes = () => {
    const {
        funcionario,
        resumenAdministrativo,
        resumenFeriados,
        detalleAdministrativo,
        detalleFeriados,
        esMovil,
        cargando
    } = useSolicitudes();

    if (cargando && !funcionario) {
        return <p className="alert alert-info text-center mt-5" role='alert'>Cargando Información...</p>;
    }

    if (!funcionario) {
        return <p className="alert alert-warning text-center mt-5" role='alert'>No se encontró información del usuario.</p>;
    }

    return (
        esMovil ? (
            <PaginaSolicitudesMovil
                resumenAdministrativo={resumenAdministrativo}
                resumenFeriados={resumenFeriados}
                detalleAdministrativo={detalleAdministrativo}
                detalleFeriados={detalleFeriados}
            />
        ) : (
            <div className="container-fluid py-4 solicitudes-page-container">
                {/* Cabecera de Página Estandarizada */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                    <div className="mb-3 mb-md-0">
                        <h2 className="mb-1 text-primary fw-bold">
                            <i className="bi bi-calendar-plus me-2"></i>{' '}
                            Solicitudes de Permisos
                        </h2>
                        {funcionario?.nombre && (
                            <p className="text-muted mb-0">
                                Gestiona tus feriados y días administrativos para el periodo actual
                            </p>
                        )}
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12">
                        <div className="solicitudes-section-card">
                            <ResumenPermisos 
                                resumenAdministrativo={resumenAdministrativo} 
                                resumenFeriados={resumenFeriados} 
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="solicitudes-section-card">
                            <FormularioSolicitud
                                resumenAdministrativo={resumenAdministrativo}
                                resumenFeriados={resumenFeriados}
                                detalleAdministrativo={detalleAdministrativo}
                                detalleFeriados={detalleFeriados}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default PaginaSolicitudes;

PaginaSolicitudes.propTypes = {
    funcionario: PropTypes.shape({
        rut: PropTypes.number.isRequired,
    }),
};