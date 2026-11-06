import PropTypes from 'prop-types';

const EncabezadoMisSolicitudes = ({ funcionario }) => (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
        <div className="mb-3 mb-md-0">
            <h2 className="mb-1 text-primary fw-bold">
                <i className="bi bi-journal-text me-2"></i>{' '}
                Mis Solicitudes
            </h2>
            {funcionario?.nombre && (
                <p className="text-muted mb-0">
                    Gestión de permisos para {funcionario.nombre} {funcionario.apellidoPaterno} {funcionario.apellidoMaterno}
                </p>
            )}
        </div>
    </div>
);

EncabezadoMisSolicitudes.propTypes = {
    funcionario: PropTypes.object,
};

export default EncabezadoMisSolicitudes;
