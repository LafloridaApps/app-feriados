import PropTypes from 'prop-types';
import { useDecretoDocument } from '../../../hooks/useDecretoDocument';

const ConsultaDecretosResults = ({ data }) => {
  const { handleViewDocument } = useDecretoDocument();

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-secondary" role="alert">
        Realice una búsqueda para mostrar los decretos generados.
      </div>
    );
  }

  const rows = data.flatMap((decreto) =>
    Array.isArray(decreto.solicitudes)
      ? decreto.solicitudes.map((solicitud) => (
        <tr key={`${decreto.idDecreto}-${solicitud.idSolicitud}`}>
          <td className="fw-bold text-primary">#{solicitud.idSolicitud}</td>
          <td className="text-nowrap">{solicitud.rutFuncionario}</td>
          <td className="fw-500">{solicitud.nombreFuncionario}</td>
          <td>
            <span className="badge bg-light text-dark border fw-normal">
              {solicitud.tipoSolicitud}
            </span>
          </td>
          <td className="fw-bold">{decreto.idDecreto || '---'}</td>
          <td className="text-center">
            {solicitud.urlPdf && (
              <a href={solicitud.urlPdf} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light border text-danger shadow-sm" title="Ver PDF">
                <i className="bi bi-file-earmark-pdf-fill"></i>
              </a>
            )}
          </td>
          <td className="text-center">
            {decreto.idDecreto && (
              <div className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-outline-primary btn-sm rounded-8"
                  onClick={() => handleViewDocument(decreto.idDecreto, false)}
                  title="Ver Documento"
                >
                  <i className="bi bi-eye-fill"></i>
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm rounded-8"
                  onClick={() => handleViewDocument(decreto.idDecreto, true)}
                  title="Descargar Decreto"
                >
                  <i className="bi bi-download"></i>
                </button>
              </div>
            )}
          </td>
        </tr>
      ))
      : []
  );

  return (
    <div className="table-responsive mt-2">
      <table className="premium-table">
        <thead>
          <tr>
            <th>ID Solicitud</th>
            <th>RUT</th>
            <th>Funcionario</th>
            <th>Tipo Solicitud</th>
            <th>Nro. Decreto</th>
            <th className="text-center">Doc</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

ConsultaDecretosResults.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ConsultaDecretosResults;
