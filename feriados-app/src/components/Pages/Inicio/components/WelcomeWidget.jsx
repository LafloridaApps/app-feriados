import { useUsuario } from '../../../../hooks/useUsuario';
import './WelcomeWidget.css'; // Importar el archivo CSS personalizado

const WelcomeWidget = () => {
    const funcionario = useUsuario();

    if (!funcionario) return null;

    const { nombre, departamento, foto, nombreJefe, escalafon } = funcionario;
    const urlFoto = foto ? `data:image/jpeg;base64,${foto}` : '';

    return (
        <div className="premium-card welcome-widget-card">
            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                <img
                    src={urlFoto}
                    alt={`Foto de ${nombre}`}
                    className="rounded-circle mb-4 mb-md-0 me-md-5 welcome-widget-image"
                    width="100"
                    height="100"
                    style={{ objectFit: 'cover' }}
                />
                <div>
                    <h2 className="welcome-title mb-2">¡Bienvenido, {nombre}!</h2>
                    <p className="welcome-subtitle mb-2">{departamento}</p>
                    {
                        escalafon !== 'ALCALDE' && (
                            <p className="welcome-text mb-0">
                                Tu jefe directo es <span className="fw-bold">{nombreJefe}</span>.
                            </p>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default WelcomeWidget;
