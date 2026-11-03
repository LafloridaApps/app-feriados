import PropTypes from 'prop-types';

const RrhhTabs = ({ activeTab, setActiveTab }) => (
    <div className="d-flex justify-content-center">
        <ul className="nav nav-tabs rrhh-tabs-nav shadow-sm">
            <li className="nav-item">
                <button className={`nav-link ${activeTab === 'generar' ? 'active' : ''}`} onClick={() => setActiveTab('generar')}>
                    <i className="bi bi-plus-circle me-2"></i> Generar
                </button>
            </li>
            <li className="nav-item">
                <button className={`nav-link ${activeTab === 'consultar' ? 'active' : ''}`} onClick={() => setActiveTab('consultar')}>
                    <i className="bi bi-search me-2"></i> Consultar
                </button>
            </li>
            <li className="nav-item">
                <button className={`nav-link ${activeTab === 'eliminar' ? 'active' : ''}`} onClick={() => setActiveTab('eliminar')}>
                    <i className="bi bi-trash me-2"></i> Eliminar
                </button>
            </li>
        </ul>
    </div>
);

RrhhTabs.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

export default RrhhTabs;
