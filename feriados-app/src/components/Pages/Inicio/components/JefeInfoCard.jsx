import PropTypes from 'prop-types';
import './JefeDashboard.css'; // Asegúrate de que los estilos compartidos estén aquí

const JefeInfoCard = ({ icon, title, children }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="jefe-info-card h-100">
                <h5 className="text-center mb-3">
                    <i className={`me-2 ${icon}`}></i>{title}
                </h5>
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
