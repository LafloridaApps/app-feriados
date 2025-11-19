import React from 'react';

const SearchSolicitud = ({ solicitudId, setSolicitudId, handleSearch, loading }) => {
    return (
        <div className="search-container">
            <h2 className="text-center mb-3">Gestión de Solicitudes</h2>
            <form onSubmit={handleSearch} className="d-flex gap-2">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="ID de Solicitud"
                    value={solicitudId}
                    onChange={(e) => setSolicitudId(e.target.value)} />
                <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                    <i className="bi bi-search"></i> {loading ? '' : 'Buscar'}
                </button>
            </form>
        </div>
    );
};

export default SearchSolicitud;
