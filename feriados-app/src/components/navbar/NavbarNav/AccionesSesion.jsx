const AccionesSesion = () => (
    <div className="d-flex align-items-center">
        <ul className="navbar-nav flex-row">
            <li className="nav-item me-3">
                <a className="nav-link" href="https://appx.laflorida.cl/login/menu.php" title="Volver al Menú Principal">
                    <i className="bi bi-arrow-left-circle text-white" style={{ fontSize: '1.25rem' }}></i>
                </a>
            </li>
            <li className="nav-item">
                <button className="btn nav-link" onClick={() => {
                    sessionStorage.clear();
                    globalThis.location.href = 'https://appx.laflorida.cl/login/';
                }} title="Cerrar Sesión">
                    <i className="bi bi-box-arrow-right text-white" style={{ fontSize: '1.25rem' }}></i>
                </button>
            </li>
        </ul>
    </div>
);

export default AccionesSesion;
