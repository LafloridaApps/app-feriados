import PropTypes from 'prop-types';

const InboxHeader = ({ isSubrogante, noLeidas, setNoLeidas, activeTab, setActiveTab, traslapesCount, isMobile, modoBusqueda }) => {
    return (
        <div className="card-header bg-white pt-3 pb-0 border-bottom">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 font-weight-bold text-primary">
                    {modoBusqueda ? 'Búsqueda de Solicitudes' : 'Bandeja de Solicitudes'}
                    {isSubrogante && <span className='badge bg-info ms-2'>Subrogante</span>}
                    {modoBusqueda && <span className='badge bg-warning text-dark ms-2'>Búsqueda</span>}
                </h5>
                {!modoBusqueda && (
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="noLeidas"
                            checked={noLeidas}
                            onChange={(e) => setNoLeidas(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="noLeidas">
                            No Leídas
                        </label>
                    </div>
                )}
            </div>
            <ul className="nav nav-tabs border-bottom-0">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'inbox' ? 'active text-primary fw-bold' : 'text-secondary'}`}
                        onClick={() => setActiveTab('inbox')}
                        style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
                    >
                        <i className="bi bi-inbox-fill me-2"></i> Lista de Solicitudes
                    </button>
                </li>
                {!isMobile && (
                    <li className="nav-item ms-2">
                        <button
                            className={`nav-link ${activeTab === 'traslapes' ? 'active text-danger fw-bold' : 'text-danger opacity-75'}`}
                            onClick={() => setActiveTab('traslapes')}
                            style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
                        >
                            <i className="bi bi-shield-exclamation me-2"></i> Análisis de Cobertura
                            {traslapesCount > 0 && (
                                <span className="badge bg-danger rounded-pill ms-2">{traslapesCount}</span>
                            )}
                        </button>
                    </li>
                )}
                {!isMobile && (
                    <li className="nav-item ms-2">
                        <button
                            className={`nav-link ${activeTab === 'informes' ? 'active text-success fw-bold' : 'text-secondary'}`}
                            onClick={() => setActiveTab('informes')}
                            style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
                        >
                            <i className="bi bi-bar-chart-fill me-2"></i> Informes
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

InboxHeader.propTypes = {
    isSubrogante: PropTypes.bool.isRequired,
    noLeidas: PropTypes.bool.isRequired,
    setNoLeidas: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    traslapesCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
    modoBusqueda: PropTypes.bool,
};

export default InboxHeader;
