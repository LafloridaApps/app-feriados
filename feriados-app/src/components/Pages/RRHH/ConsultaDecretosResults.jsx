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
            <th>ID Decreto</th>
            <th>Fecha Decreto</th>
            <th>ID Solicitud</th>
            <th>RUT Funcionario</th>
            <th>Nombre Funcionario</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((decreto) => (
            decreto.solicitudes.map((solicitud) => (
              <tr key={`${decreto.idDecreto}-${solicitud.idSolicitud}`}>
                <td>{decreto.idDecreto}</td>
                <td>{decreto.fechaDecreto}</td>
                <td>{solicitud.idSolicitud}</td>
                <td>{solicitud.rutFuncionario}</td>
                <td>{solicitud.nombreFuncionario}</td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => handleViewDocument(decreto.idDecreto, false)}
                    title="Ver Documento"
                  >
                    <i className="bi bi-eye-fill"></i> Ver Documento
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleViewDocument(decreto.idDecreto, true)}
                    title="Descargar Decreto"
                  >
                    <i className="bi bi-download"></i> Descargar Decreto
                  </button>
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
