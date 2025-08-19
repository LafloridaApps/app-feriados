import { PropTypes } from 'prop-types';
import { useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';


const Inicio = () => {

    const funcionario = useContext(UsuarioContext);

    if (!funcionario) return <p className="alert alert-info text-center mt-5" role='alert'>Cargando funcionario...</p>;

    const { nombre, departamento, foto, nombreJefe } = funcionario;
    const fotoUrl = foto ? `data:image/jpeg;base64,${foto}` : '';

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="card shadow-lg rounded-4 p-4" style={{ width: '25rem', background: '#f0f8ff' }}>
                <div className="d-flex flex-column align-items-center text-center">
                    <img
                        src={fotoUrl}
                        alt={`Foto de ${nombre}`}
                        className="rounded-circle mb-3"
                        width="150"
                        height="150"
                        style={{ objectFit: 'cover', border: '4px solid #007bff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    />
                    <h3 className="font-weight-bold text-primary">¡Bienvenido, <br></br>{nombre}!</h3>
                    <p className="text-muted">{departamento}</p>
                    <p className="lead" style={{ color: '#333' }}>
                        Tu jefe directo es <span className="font-italic text-dark"> <strong>{nombreJefe}</strong></span>.
                    </p>

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