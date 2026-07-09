import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDecretoDocument } from '../../../hooks/useDecretoDocument';
import { getExcelDecreto } from '../../../services/docService';

const ConsultaDecretosResults = ({ data }) => {
  const { handleViewDocument } = useDecretoDocument();
  const [expandedDecretos, setExpandedDecretos] = useState({});

  const toggleDetalle = (idDecreto) => {
    setExpandedDecretos(prev => ({ ...prev, [idDecreto]: !prev[idDecreto] }));
  };

  const handleDownloadExcel = async (idDecreto) => {
    try {
      const response = await getExcelDecreto(idDecreto);
      const url = globalThis.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `solicitudes-${idDecreto}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      globalThis.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar Excel:', error);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-secondary" role="alert">
        Realice una búsqueda para mostrar los decretos generados.
      </div>
    );
  }

  const totalSolicitudes = data.reduce((acc, d) => acc + (d.solicitudes?.length || 0), 0);

  return (
    <div className="d-flex flex-column gap-4 mt-2">
      <div className="bg-white p-4 rounded-16 shadow-sm border-start border-4 border-primary d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h5 className="mb-1 fw-bold text-dark d-flex align-items-center gap-2">
            <i className="bi bi-search text-primary"></i>{' '}
            Resultados de la Búsqueda
          </h5>
          <p className="mb-0 text-muted small">
            {data.length} decreto{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}
            {' '}· {totalSolicitudes} solicitud{totalSolicitudes !== 1 ? 'es' : ''} asociada{totalSolicitudes !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {data.map((decreto) => {
        const isExpanded = expandedDecretos[decreto.idDecreto] || false;
        const solicitudes = Array.isArray(decreto.solicitudes) ? decreto.solicitudes : [];

        return (
          <div key={decreto.idDecreto} className="card border-0 shadow-sm rounded-16 overflow-hidden">
            <div className="card-header bg-white py-3 px-4 border-start border-4 border-primary d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <i className="bi bi-calendar3"></i>
                  <span className="fw-semibold">{decreto.fechaDecreto || '---'}</span>
                </div>
                <div className="vr text-muted" style={{ opacity: 0.3 }}></div>
                <h6 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-file-earmark-text text-primary"></i>{' '}
                  Decreto #{decreto.idDecreto}
                </h6>
                <span className="badge rounded-pill bg-light text-primary border border-primary fs-7 px-2 py-1">
                  {solicitudes.length} solicitud{solicitudes.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm rounded-8 fw-semibold"
                  onClick={() => handleViewDocument(decreto.idDecreto, true)}
                  title="Descargar Word"
                >
                  <i className="bi bi-download me-1"></i>{' '}Word
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm rounded-8 fw-semibold"
                  onClick={() => handleDownloadExcel(decreto.idDecreto)}
                  title="Descargar Excel"
                >
                  <i className="bi bi-table me-1"></i>{' '}Excel
                </button>
                <button
                  className={`btn btn-sm rounded-8 fw-semibold ${isExpanded ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => toggleDetalle(decreto.idDecreto)}
                  title={isExpanded ? 'Ocultar detalle' : 'Ver detalle'}
                >
                  <i className={`bi ${isExpanded ? 'bi-eye-slash' : 'bi-eye'} me-1`}></i>{' '}
                  {isExpanded ? 'Ocultar' : 'Detalle'}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="premium-table mb-0">
                    <thead>
                      <tr>
                        <th>ID Solicitud</th>
                        <th>RUT</th>
                        <th>Funcionario</th>
                        <th>Tipo Solicitud</th>
                        <th className="text-center">PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudes.length > 0 ? solicitudes.map((solicitud) => (
                        <tr key={`${decreto.idDecreto}-${solicitud.idSolicitud}`}>
                          <td className="fw-bold text-primary">#{solicitud.idSolicitud}</td>
                          <td className="text-nowrap">{solicitud.rutFuncionario}</td>
                          <td className="fw-500">{solicitud.nombreFuncionario}</td>
                          <td>
                            <span className="badge bg-light text-dark border fw-normal">
                              {solicitud.tipoSolicitud}
                            </span>
                          </td>
                          <td className="text-center">
                            {solicitud.urlPdf ? (
                              <a
                                href={solicitud.urlPdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-danger rounded-8"
                                title="Ver PDF"
                              >
                                <i className="bi bi-file-earmark-pdf-fill"></i>
                              </a>
                            ) : (
                              <span className="text-muted small">---</span>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-4">
                            <i className="bi bi-inbox d-block mb-2 fs-4"></i>{' '}
                            No hay solicitudes asociadas a este decreto.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

ConsultaDecretosResults.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ConsultaDecretosResults;
