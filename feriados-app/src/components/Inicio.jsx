import { PropTypes } from 'prop-types';
import { useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';


const Inicio = () => {

    const funcionario = useContext(UsuarioContext);

    if (!funcionario) return <p className="alert alert-info text-center mt-5" role='alert'>Cargando funcionario...</p>;

    const { nombres, paterno, materno, departamento, jefe, foto } = funcionario;
    const fotoUrl = foto ? `data:image/jpeg;base64,${foto}` : '';
    const departamentoLimpio = departamento.split('||')[0];

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="card shadow-lg rounded-4 p-4" style={{ width: '25rem', background: '#f0f8ff' }}>
                <div className="d-flex flex-column align-items-center text-center">
                    <img
                        src={fotoUrl}
                        alt={`Foto de ${nombres}`}
                        className="rounded-circle mb-3"
                        width="150"
                        height="150"
                        style={{ objectFit: 'cover', border: '4px solid #007bff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    />
                    <h3 className="font-weight-bold text-primary">¡Bienvenido, <br></br>{nombres} {paterno} {materno}!</h3>
                    <p className="text-muted">{departamentoLimpio}</p>
                    <p className="lead" style={{ color: '#333' }}>
                        Tu jefe directo es <span className="font-italic text-dark"> <strong>{jefe}</strong></span>.
                    </p>

                    <div className="mt-3 text-muted">
                        <small>Estamos aquí para ayudarte en todo lo que necesites. ¡Que tengas un gran día!</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inicio;

Inicio.propTypes = {
    funcionario: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        apellido: PropTypes.string.isRequired,
        departamento: PropTypes.string.isRequired,
        jefe: PropTypes.string.isRequired,
        foto: PropTypes.string,
    }),
};