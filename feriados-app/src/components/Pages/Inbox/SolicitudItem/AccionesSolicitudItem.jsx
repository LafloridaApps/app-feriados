const AccionesSolicitudItem = ({
    acciones,
    estadoSolicitud,
    tieneAnulacionPendiente,
    handlerEntrada,
    handlerVisar,
    handlerAprobar,
    handlePostergar,
    handleVerAnulacion
}) => (
    <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
        {acciones.puedeRecibir && estadoSolicitud !== 'ANULADA' && (
            <button
                className="btn btn-outline-success btn-sm rounded-pill px-3"
                onClick={() => handlerEntrada(acciones.idDerivacion)}
                title="Recibir"
            >
                Recibir <i className="bi bi-box-arrow-in-down ms-1"></i>
            </button>
        )}
    {acciones.puedePostergar && estadoSolicitud !== 'ANULADA' && (
            <button
                className="btn btn-outline-warning btn-sm rounded-pill px-3"
                title="Postergar"
                onClick={handlePostergar}
            >
                Postergar <i className="bi bi-clock-history ms-1"></i>
            </button>
        )}
        {acciones.puedeVisar && estadoSolicitud !== 'ANULADA' && (
            <button
                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                onClick={() => handlerVisar(acciones.idDerivacion)}
                title="Visar"
            >
                Visar <i className="bi bi-check-all ms-1"></i>
            </button>
        )}
        {acciones.esDerivada && (
            <span className='badge bg-success bg-opacity-10 text-success border border-success-subtle rounded-pill px-3 py-2'>
                <i className="bi bi-arrow-right-circle me-1"></i> DERIVADA
            </span>
        )}
    {acciones.puedeFirmar && estadoSolicitud !== 'ANULADA' && (
            <button
                onClick={() => handlerAprobar(acciones.idDerivacion)}
                className="btn btn-success btn-sm rounded-pill px-3 shadow-sm"
                title="Firmar"
            >
                Firmar <i className="bi bi-patch-check-fill ms-1"></i>
            </button>
        )}
        {acciones.esFinalizada && (
            <span className='badge bg-success text-white rounded-pill px-3 py-2 shadow-sm'>
                <i className="bi bi-check-circle-fill me-1"></i> FIRMADA
            </span>
        )}
        {acciones.esPostergada && (
            <span className='badge bg-danger bg-opacity-10 text-danger border border-danger-subtle rounded-pill px-3 py-2'>
                <i className="bi bi-clock-fill me-1"></i> POSTERGADA
            </span>
        )}
        {tieneAnulacionPendiente && (
            <button
                className="btn btn-sm"
                onClick={handleVerAnulacion}
                title="Anulación pendiente — clic para ver detalle"
                style={{
                    width: 34,
                    height: 34,
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff7ed',
                    color: '#ea580c',
                    border: '1.5px solid #f97316',
                    borderRadius: '50%',
                    fontSize: '0.95rem',
                    boxShadow: '0 0 0 3px rgba(249,115,22,0.15)',
                    animation: 'pulse-orange 1.4s infinite',
                    transition: 'all 0.2s',
                }}
            >
                <i className="bi bi-bell-fill" />
            </button>
        )}
    </div>
);

export default AccionesSolicitudItem;
