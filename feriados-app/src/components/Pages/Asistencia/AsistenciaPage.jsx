import { useAsistencia } from "../../../hooks/useAsistencia";
import './AsistenciaPage.css';

const AsistenciaPage = () => {
    const {
        funcionario,
        mes,
        setMes,
        anio,
        setAnio,
        datosAsistencia,
        cargando,
        obtenerAsistencia,
        formatearHora,
        formatearFecha,
        formatearDecimal,
        totales
    } = useAsistencia();

    const meses = [
        { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
        { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
        { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
        { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
    ];

    const anios = [2023, 2024, 2025, 2026];

    const renderTableContent = () => {
        if (cargando) {
            return (
                <tr>
                    <td colSpan="8" className="text-center py-5">
                        <output className="spinner-border text-info">
                            <span className="visually-hidden">Cargando...</span>
                        </output>
                    </td>
                </tr>
            );
        }

        if (datosAsistencia.length === 0) {
            return (
                <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                        No hay registros para el periodo seleccionado.
                    </td>
                </tr>
            );
        }

        return (
            <>
                {datosAsistencia.map((row) => (
                    <tr key={row.fechadia} className={row.dia === 'DOM' ? 'table-light' : ''}>
                        <td className={`ps-4 fw-medium ${row.dia === 'DOM' || row.dia === 'SAB' ? 'text-danger' : 'text-secondary'}`}>
                            {row.dia}
                        </td>
                        <td className="font-monospace small">{formatearFecha(row.fechadia)}</td>
                        <td>
                            <span className={`badge ${row.horentmantj ? 'bg-white text-dark' : 'bg-light text-muted'} border font-monospace`}>
                                {formatearHora(row.horentmantj)}
                            </span>
                        </td>
                        <td>
                            <span className={`badge ${row.horsaltartj ? 'bg-white text-dark' : 'bg-light text-muted'} border font-monospace`}>
                                {formatearHora(row.horsaltartj)}
                            </span>
                        </td>
                        <td>
                            <span className="text-muted small">
                                {row.justinasautext || '-'}
                            </span>
                        </td>
                        <td className="fw-bold text-warning">{formatearDecimal(row.hatr)}</td>
                        <td>
                            <span className={Number.parseFloat(row.hext25) > 0 ? 'text-primary fw-bold' : 'text-muted'}>
                                {formatearDecimal(row.hext25)}
                            </span>
                        </td>
                        <td className="pe-4">
                            <span className={Number.parseFloat(row.hext50) > 0 ? 'text-danger fw-bold' : 'text-muted'}>
                                {formatearDecimal(row.hext50)}
                            </span>
                        </td>
                    </tr>
                ))}
            </>
        );
    };

    if (!funcionario) return <output className="alert alert-info text-center mt-5 d-block">Cargando Información...</output>;

    if (funcionario.ident !== 1) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center shadow-sm border-0 rounded-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{' '}
                    No tienes permisos para acceder al registro de asistencia.
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 asistencia-page-container">
            {/* Standardized Page Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-info">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-1 text-info fw-bold">
                        <i className="bi bi-clock-history me-2"></i>{' '}
                        Registro de Asistencia
                    </h2>
                    <p className="text-muted mb-0">
                        Consulta tu registro de jornada, atrasos y horas extraordinarias
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <select
                        className="form-select form-select-sm"
                        value={mes}
                        onChange={(e) => setMes(Number.parseInt(e.target.value))}
                        style={{ width: 'auto' }}
                    >
                        {meses.map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                    <select
                        className="form-select form-select-sm"
                        value={anio}
                        onChange={(e) => setAnio(Number.parseInt(e.target.value))}
                        style={{ width: 'auto' }}
                    >
                        {anios.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                    <button
                        className="btn btn-info btn-sm text-white px-3"
                        onClick={obtenerAsistencia}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <output className="spinner-border spinner-border-sm me-1" aria-hidden="true"></output>
                        ) : (
                            <i className="bi bi-search me-1"></i>
                        )}
                        Consultar
                    </button>
                </div>
            </div>

            <div className="card shadow-sm border-0 rounded-3">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark">
                        Detalle Mensual - {meses.find(m => m.id === mes)?.nombre} {anio}
                    </h5>
                    <span className="badge bg-info-soft text-info border border-info-subtle px-3 py-2">
                        {datosAsistencia.length} Días Registrados
                    </span>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light sticky-top">
                                <tr>
                                    <th className="ps-4">Día</th>
                                    <th>Fecha</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Justificación</th>
                                    <th>Atrasos</th>
                                    <th>Horas 25%</th>
                                    <th className="pe-4">Horas 50%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableContent()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer bg-white py-3">
                    <div className="row text-center g-0">
                        <div className="col-md-4 border-end">
                            <span className="text-muted small d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Total Atrasos</span>
                            <span className="fs-5 fw-bold text-warning">{formatearDecimal(totales.hatr)}</span>
                        </div>
                        <div className="col-md-4 border-end">
                            <span className="text-muted small d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Total Extras 25%</span>
                            <span className="fs-5 fw-bold text-primary">{formatearDecimal(totales.h25)}</span>
                        </div>
                        <div className="col-md-4">
                            <span className="text-muted small d-block text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Total Extras 50%</span>
                            <span className="fs-5 fw-bold text-danger">{formatearDecimal(totales.h50)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AsistenciaPage;
