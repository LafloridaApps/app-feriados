import './Footer.css';
import { LOGO_URL } from '../../assets/constants';
import { SELLO } from '../../assets/constants';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 text-center text-md-start">
            <img src={LOGO_URL} alt="Logo Horizontal" className="img-fluid logo-horizontal" />
          </div>
          <div className="col-md-4 text-center">
            <span className="text-muted">© 2025 Municipalidad de La Florida. Todos los derechos reservados.</span>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <img src={SELLO} alt="Logo Vertical" className="img-fluid logo-vertical" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
