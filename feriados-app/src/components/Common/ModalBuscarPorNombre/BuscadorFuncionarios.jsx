const BuscadorFuncionarios = ({ searchTerm, setSearchTerm, searching, handleSearch }) => (
    <div className="mb-3">
        <label htmlFor="searchTerm" className="form-label">Nombre o apellido</label>
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ingrese nombre o apellido..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

            />
            <button
                className="btn btn-primary"
                type="button"
                onClick={handleSearch}
                disabled={searching || !searchTerm.trim()}
            >
                {searching
                    ? <><output className="spinner-border spinner-border-sm me-2"></output>Buscando...</>
                    : <><i className="bi bi-search me-1"></i>Buscar</>
                }
            </button>
        </div>
        <div className="form-text">Presione Enter o haga clic en Buscar</div>
    </div>
);

export default BuscadorFuncionarios;
