import React from 'react';
import PropTypes from 'prop-types';
import { useDecretoDocument } from '../../../hooks/useDecretoDocument';

const ConsultaDecretosResults = ({ data }) => {
  console.log('Datos recibidos en ConsultaDecretosResults:', data);
  const { handleViewDocument } = useDecretoDocument();

  if (data.length === 0) {
    return (
      <div className="alert alert-secondary" role="alert">
        Realice una búsqueda para mostrar los decretos generados.
      </div>
    );
  }

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
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((decreto) => (
            decreto.solicitudes.map((solicitud, index) => (
              <tr key={`${decreto.idDecreto}-${solicitud.idSolicitud}-${index}`}>
                <td>{solicitud.idSolicitud}</td>
                <td>{solicitud.rutFuncionario}</td>
                <td>{solicitud.nombreFuncionario}</td>
                <td>N/A</td> {/* Tipo Solicitud is not in the new response */}
                <td>{decreto.fechaDecreto}</td>
                <td>{decreto.idDecreto || 'N/A'}</td>
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
                  {/* Removed aprobacion.url as it's not in the new response */}
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

ConsultaDecretosResults.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ConsultaDecretosResults;
