import React from 'react';
import PropTypes from 'prop-types';

const ConsultaDecretosResults = ({ data }) => {
  console.log('Datos recibidos en ConsultaDecretosResults:', data);
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
            <th>Documento</th>
          </tr>
        </thead>
        <tbody>
          {data.map((decreto) => {
            console.log('Procesando decreto:', decreto); // Nuevo console.log
            return decreto.solicitudes.map((solicitud) => {
              console.log('Procesando solicitud:', solicitud); // Nuevo console.log
              return (
                <tr key={`${decreto.idDecreto}-${solicitud.idSolicitud}`}>
                  <td>{decreto.idDecreto}</td>
                  <td>{decreto.fechaDecreto}</td>
                  <td>{solicitud.idSolicitud}</td>
                  <td>{solicitud.rutFuncionario}</td>
                  <td>{solicitud.nombreFuncionario}</td>
                  <td>
                    {/* Si hay un documento asociado al decreto, puedes mostrarlo aquí */}
                    {/* Por ahora, asumo que el documento está en el objeto decreto */}
                    {decreto.documento && (
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-decoration-none">
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                        </a>
                    )}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

ConsultaDecretosResults.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ConsultaDecretosResults;
