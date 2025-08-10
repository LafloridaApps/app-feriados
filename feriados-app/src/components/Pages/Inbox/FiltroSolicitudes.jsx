import { useState } from 'react';
import PropTypes from 'prop-types';

const FiltrosSolicitudes = ({ onFiltrar }) => {
    const [anio, setAnio] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [nombreSolicitante, setNombreSolicitante] = useState('');
    const [rutSolicitante, setRutSolicitante] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleFiltrar = () => {
        const filtros = {
            anio,
            fechaInicio,
            fechaFin,
            nombreSolicitante,
            rutSolicitante,
        };
        onFiltrar(filtros);
    };

    const handleLimpiarFiltros = () => {
        setAnio('');
        setFechaInicio('');
        setFechaFin('');
        setNombreSolicitante('');
        setRutSolicitante('');
        onFiltrar({}); 
    };

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 font-weight-bold text-primary">
                    <i className="bi bi-funnel-fill me-2"></i> Filtrar Solicitudes
                </h6>
                <button className="btn btn-sm btn-outline-secondary" onClick={toggleCollapse}>
                    {isOpen ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                </button>
            </div>
            <div className={`card-body collapse ${isOpen ? 'show' : ''}`}>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label htmlFor="anio" className="form-label"><i className="bi bi-calendar-date me-1"></i> Año</label>
                        <input type="number" className="form-control" id="anio" value={anio} onChange={(e) => setAnio(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="fechaInicio" className="form-label"><i className="bi bi-calendar-range me-1"></i> Fecha Inicio</label>
                        <input type="date" className="form-control" id="fechaInicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="fechaFin" className="form-label"><i className="bi bi-calendar-range-fill me-1"></i> Fecha Fin</label>
                        <input type="date" className="form-control" id="fechaFin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="nombreSolicitante" className="form-label"><i className="bi bi-person-fill me-1"></i> Nombre Solicitante</label>
                        <input type="text" className="form-control" id="nombreSolicitante" value={nombreSolicitante} onChange={(e) => setNombreSolicitante(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="rutSolicitante" className="form-label"><i className="bi bi-person-vcard-fill me-1"></i> Rut Solicitante</label>
                        <input type="text" className="form-control" id="rutSolicitante" value={rutSolicitante} onChange={(e) => setRutSolicitante(e.target.value)} />
                    </div>
                </div>
                <div className="mt-3">
                    <button className="btn btn-primary me-2" onClick={handleFiltrar}>
                        <i className="bi bi-search me-1"></i> Filtrar
                    </button>
                    <button className="btn btn-secondary" onClick={handleLimpiarFiltros}>
                        <i className="bi bi-x-octagon-fill me-1"></i> Limpiar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

FiltrosSolicitudes.propTypes = {
    onFiltrar: PropTypes.func.isRequired,
};

export default FiltrosSolicitudes;