import React from 'react';
import PropTypes from 'prop-types';

const ConsultaDecretosResults = ({ data }) => {
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
            <th>Rut</th>
            <th>Nombre</th>
            <th>Tipo Solicitud</th>
            <th>Fecha Desde</th>
            <th>Fecha Hasta</th>
            <th>Duración</th>
            <th>Contrato</th>
            <th>Departamento</th>
            <th>Documento</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.decretoId}</td>
              <td>{item.fechaDecreto}</td>
              <td>{item.rut}</td>
              <td>{item.nombre}</td>
              <td>{item.tipoSolicitud}</td>
              <td>{item.fechaDesde}</td>
              <td>{item.fechaHasta}</td>
              <td>{item.duracion}</td>
              <td>{item.contrato}</td>
              <td>{item.departamento}</td>
              <td>
                {item.documento && (
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-decoration-none">
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                    </a>
                )}
              </td>
            </tr>
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
