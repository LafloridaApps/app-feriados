import PropTypes from 'prop-types';
import './AdministracionLayout.css';

export default function AdministracionLayout({ titulo, descripcion, children }) {
    return <section className="container admin-page py-4" aria-label={titulo}>
        <header className="admin-page-header">
            <span className="admin-eyebrow">Administración</span>
            <h1>{titulo}</h1>
            <p>{descripcion}</p>
        </header>
        {children}
    </section>;
}
AdministracionLayout.propTypes = {
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
