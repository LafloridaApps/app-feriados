import PropTypes from 'prop-types';

const BuscadorDepartamentos = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="mb-3">
            <label htmlFor="searchDepto" className="form-label fw-bold">Nombre del Departamento</label>
            <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                    type="text"
                    className="form-control"
                    id="searchDepto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ingrese nombre para filtrar..."
                />
            </div>
        </div>
    );
};

BuscadorDepartamentos.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
};

export default BuscadorDepartamentos;
