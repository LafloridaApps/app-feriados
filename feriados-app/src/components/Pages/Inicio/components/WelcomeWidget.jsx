import { useUsuario } from '../../../../hooks/useUsuario';
import './WelcomeWidget.css'; // Importar el archivo CSS personalizado

const WelcomeWidget = () => {
    const funcionario = useUsuario();

    if (!funcionario) return null;

    const { nombre, departamento, foto, nombreJefe, escalafon } = funcionario;
    const urlFoto = foto ? `data:image/jpeg;base64,${foto}` : null;

    return (
        <div className="premium-card welcome-widget-card">
            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                {urlFoto ? (
                    <img
                        src={urlFoto}
                        alt={`Foto de ${nombre}`}
                        className="rounded-circle mb-4 mb-md-0 me-md-5 welcome-widget-image"
                        width="100"
                        height="100"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        className="rounded-circle mb-4 mb-md-0 me-md-5 welcome-widget-image d-flex align-items-center justify-content-center"
                        style={{
                            width: 100,
                            height: 100,
                            background: 'linear-gradient(135deg, #009B4D, #004B8D)',
                            color: 'white',
                            fontSize: '2rem',
                            fontWeight: 700,
                            flexShrink: 0,
                        }}
                        aria-label={`Avatar de ${nombre}`}
                    >
                        {nombre?.charAt(0).toUpperCase()}
                    </div>
                )}
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
