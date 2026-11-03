import { Link } from 'react-router-dom';
import { LOGO_URL } from '../../assets/constants';
import SidebarMenu from './Sidebar/SidebarMenu';
import { useSidebar } from './Sidebar/useSidebar';
import './Sidebar.css';

const Sidebar = () => {
    const sidebar = useSidebar();
    const { isSidebarOpen, toggleSidebar, closeSidebar } = sidebar;

    return (
        <>
            <button className="mobile-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                <i className={`bi ${isSidebarOpen ? 'bi-x' : 'bi-list'}`}></i>
            </button>

            {isSidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar} aria-hidden="true"></div>}

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" onClick={closeSidebar}>
                        <img src={LOGO_URL} alt="Logo FeriadosApp" width="120" height="48" />
                    </Link>
                </div>

                <SidebarMenu {...sidebar} />

                <div className="sidebar-footer">
                    <a className="footer-btn" href="https://intranet.laflorida.cl/home" title="Volver al Menú Principal">
                        <i className="bi bi-arrow-left-circle"></i>
                        <span>Menú Principal</span>
                    </a>
                    
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
