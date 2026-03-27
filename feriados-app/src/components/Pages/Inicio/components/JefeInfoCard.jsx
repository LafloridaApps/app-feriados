import PropTypes from 'prop-types';
import './JefeDashboard.css'; // Asegúrate de que los estilos compartidos estén aquí

const JefeInfoCard = ({ icono, titulo, children }) => {
    // Determine icon color class based on the icon provided
    const obtenerClaseIcono = () => {
        if (icono.includes('warning')) return 'icon-warning';
        if (icono.includes('info')) return 'icon-info';
        if (icono.includes('danger')) return 'icon-danger';
        return 'icon-info';
    };

    return (
        <div className="col-md-4 mb-4">
            <div className="premium-card jefe-info-card-premium">
                <div className="jefe-card-header">
                    <div className={`jefe-card-icon-wrapper ${obtenerClaseIcono()}`}>
                        <i className={icono}></i>
                    </div>
                    <h5 className="jefe-card-title">{titulo}</h5>
                </div>
                {children}
            </div>
        </div>
    );
};

JefeInfoCard.propTypes = {
    icono: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default JefeInfoCard;
