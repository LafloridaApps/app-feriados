import PropTypes from 'prop-types';
import { useDecretoDocument } from '../../../hooks/useDecretoDocument';
import { formatFechaString } from '../../../services/utils';

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
          <td>{solicitud.idSolicitud}</td>
          <td>{solicitud.rutFuncionario}</td>
          <td>{solicitud.nombreFuncionario}</td>
          <td>{solicitud.tipoSolicitud}</td>
          <td>{formatFechaString(decreto.fechaDecreto)}</td>
          <td>{decreto.idDecreto || 'N/A'}</td>
          <td className="text-center">
            {solicitud.urlPdf && (
              <a href={solicitud.urlPdf} target="_blank" rel="noopener noreferrer" className="text-decoration-none" title="Ver PDF">
                <i className="bi bi-file-earmark-pdf-fill"></i>
              </a>
            )}
          </td>
          <td className="text-center">
            {decreto.idDecreto && (
              <>
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => handleViewDocument(decreto.idDecreto, false)}
                  title="Ver Documento"
                >
                  <i className="bi bi-eye-fill"></i> Ver
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleViewDocument(decreto.idDecreto, true)}
                  title="Descargar Decreto"
                >
                  <i className="bi bi-download"></i> Descargar
                </button>
              </>
            )}
          </td>
        </tr>
      ))
      : []
  );

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID Solicitud</th>
            <th>RUT Funcionario</th>
            <th>Nombre Funcionario</th>
            <th>Tipo Solicitud</th>
            <th>Fechas</th>
            <th>Nro. Decreto</th>
            <th className="text-center">Documento</th>
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
