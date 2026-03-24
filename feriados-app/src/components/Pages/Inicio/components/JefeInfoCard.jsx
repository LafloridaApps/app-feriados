import PropTypes from 'prop-types';
import './JefeDashboard.css'; // Asegúrate de que los estilos compartidos estén aquí

const JefeInfoCard = ({ icon, title, children }) => {
    // Determine icon color class based on the icon provided
    const getIconClass = () => {
        if (icon.includes('warning')) return 'icon-warning';
        if (icon.includes('info')) return 'icon-info';
        if (icon.includes('danger')) return 'icon-danger';
        return 'icon-info';
    };

    return (
        <div className="col-md-4 mb-4">
            <div className="premium-card jefe-info-card-premium">
                <div className="jefe-card-header">
                    <div className={`jefe-card-icon-wrapper ${getIconClass()}`}>
                        <i className={icon}></i>
                    </div>
                    <h5 className="jefe-card-title">{title}</h5>
                </div>
                {children}
            </div>
        </div>
    );
};

JefeInfoCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default JefeInfoCard;
