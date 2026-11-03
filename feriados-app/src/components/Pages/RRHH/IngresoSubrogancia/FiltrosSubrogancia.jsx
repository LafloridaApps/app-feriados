import { FaSearch } from 'react-icons/fa';
const FiltrosSubrogancia = ({
    filtroRutJefe,
    setFiltroRutJefe,
    filtroRutSubrogante,
    setFiltroRutSubrogante,
    filtroDepartamento,
    setFiltroDepartamento,
    setFiltroIdDepto,
    mostrarSugerencias,
    setMostrarSugerencias,
    setShowDeptoModal,
    departamentos,
    isSearching,
    handleSearch,
    handleLimpiarFiltros,
    handleOpenBusquedaModal
}) => (
    <>
        <h5 className="section-title"><FaSearch /> Filtros de Búsqueda</h5>
        <form onSubmit={handleSearch} className="mb-4">
            <div className="row g-3">
                <div className="col-md-4 form-group-custom">
                    <label htmlFor="filtroRutJefe">RUT Jefe</label>
                    <div className="input-group">
                        <input id="filtroRutJefe" type="text" className="form-control input-custom" placeholder="Ej: 12345678-9" value={filtroRutJefe} onChange={(e) => setFiltroRutJefe(e.target.value)} />
                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleOpenBusquedaModal('filtroJefe')} title="Buscar por nombre">
                            <FaSearch />
                        </button>
                    </div>
                </div>
                <div className="col-md-4 form-group-custom">
                    <label htmlFor="filtroRutSubrogante">RUT Subrogante</label>
                    <div className="input-group">
                        <input id="filtroRutSubrogante" type="text" className="form-control input-custom" placeholder="Ej: 98765432-1" value={filtroRutSubrogante} onChange={(e) => setFiltroRutSubrogante(e.target.value)} />
                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleOpenBusquedaModal('filtroSub')} title="Buscar por nombre">
                            <FaSearch />
                        </button>
                    </div>
                </div>
                <div className="col-md-4 form-group-custom">
                    <label htmlFor="filtroDepartamento">Departamento</label>
                    <div className="input-group autocomplete-container">
                        <input
                            id="filtroDepartamento"
                            type="text"
                            className="form-control input-custom"
                            placeholder="Nombre de depto"
                            value={filtroDepartamento}
                            onChange={(e) => {
                                setFiltroDepartamento(e.target.value);
                                setFiltroIdDepto(''); // Reset ID if user types manually
                                setMostrarSugerencias(true);
                            }}
                            onFocus={() => setMostrarSugerencias(true)}
                            onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                            autoComplete="off"
                        />
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button" 
                            onClick={() => setShowDeptoModal(true)} 
                            title="Buscar en tabla de departamentos"
                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        >
                            <FaSearch />
                        </button>
                        {mostrarSugerencias && filtroDepartamento.length > 1 && (
                            <div className="autocomplete-suggestions">
                                {departamentos
                                    .filter(d => 
                                        d?.nombreDepartamento?.toLowerCase().includes(filtroDepartamento.toLowerCase())
                                    )
                                    .slice(0, 10)
                                    .map(depto => (
                                        <button 
                                            key={depto.idDepto} 
                                            className="suggestion-item w-100 text-start border-0 bg-transparent"
                                            type="button"
                                            onClick={() => {
                                                setFiltroDepartamento(depto.nombreDepartamento);
                                                setFiltroIdDepto(depto.idDepto);
                                                setMostrarSugerencias(false);
                                            }}
                                        >
                                            {depto.nombreDepartamento}
                                        </button>
                                    ))
                                }
                                {departamentos.filter(d => 
                                    d?.nombreDepartamento?.toLowerCase().includes(filtroDepartamento.toLowerCase())
                                ).length === 0 && (
                                    <div className="suggestion-item text-muted">No se encontraron departamentos</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-12 d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleLimpiarFiltros}
                        disabled={isSearching}
                    >
                        Limpiar filtros
                    </button>
                    <button type="submit" className="btn btn-custom-primary" disabled={isSearching}>
                        {isSearching ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </div>
        </form>
    </>
);

export default FiltrosSubrogancia;
