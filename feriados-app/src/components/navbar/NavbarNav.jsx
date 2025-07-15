import PropTypes from "prop-types";



const NavbarNav = ({ esJefe, cantidadNoLeidas }) => (

    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
            <a className="nav-link active" href="/">Inicio</a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="/mis-solicitudes">Mis Solicitudes</a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="/solicitudes">Nueva Solicitud</a>
        </li>
        <li className="nav-item dropdown">
            <button
                className="nav-link dropdown-toggle btn btn-link"
                id="rrhhDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                RRHH
            </button>
            <ul className="dropdown-menu" aria-labelledby="rrhhDropdown">
                <li><a className="dropdown-item" href="/feriados">Feriados Legales</a></li>
                <li><a className="dropdown-item" href="/administrativos">Administrativos</a></li>
            </ul>
        </li>
        {esJefe && (
            <li className="nav-item">
                <a className="nav-link d-flex align-items-center justify-content-between" href="/inbox">
                    Bandeja de Solicitudes
                    {cantidadNoLeidas > 0 && (
                        <span className="badge bg-danger rounded-pill ms-2">
                            {cantidadNoLeidas}
                        </span>
                    )}
                </a>
            </li>
        )
        }
        <li className="nav-item dropdown">
            <button
                className="nav-link dropdown-toggle btn btn-link"
                id="paramDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Parametros
            </button>
            <ul className="dropdown-menu" aria-labelledby="rrhhDropdown">
                <li><a className="dropdown-item" href="/deptos">Departamentos</a></li>
            </ul>
        </li>
    </ul>
);

export default NavbarNav;

NavbarNav.propTypes = {
    esJefe: PropTypes.bool.isRequired,
    cantidadNoLeidas: PropTypes.number.isRequired,
};
