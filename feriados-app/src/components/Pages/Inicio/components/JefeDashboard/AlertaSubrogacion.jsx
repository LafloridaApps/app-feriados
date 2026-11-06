import { formatFecha } from '../../../../../services/utils';

const AlertaSubrogacion = ({ departamentosSubrogados }) => {
    if (departamentosSubrogados.length === 0) return null;

    return (
        <div className="subrogacion-alert" role="alert">
            <div className="subrogacion-title">
                <i className="bi bi-person-badge"></i> ¡Estás subrogando!
            </div>
            <p className="mb-2 small">Actualmente estás a cargo de los siguientes departamentos:</p>
            <div className="subrogacion-list">
                {departamentosSubrogados.map((departamento, indice) => (
                    <div key={departamento.idDepto || indice} className="fw-bold small mb-1">
                        • {departamento.nombreDepartamento} <span className="fw-normal text-muted ms-2">({formatFecha(departamento.fechaDesde)} - {formatFecha(departamento.fechaHasta)})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertaSubrogacion;
