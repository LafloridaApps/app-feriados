import { LOGO_URL } from '../../assets/constants';

const NavbarBrand = () => (
    <a className="navbar-brand d-flex align-items-center" href="/">
        <img
            src={LOGO_URL}
            alt="Logo FeriadosApp"
            width="100"
            height="40"
            className="me-2"
        />
    </a>
);

export default NavbarBrand;
