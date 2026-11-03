import PaginaCalendarioAusenciasMobile from '../PaginaCalendarioAusenciasMobile';
import CalendarioDashboard from '../CalendarioDashboard';
import ModalDetalleFuncionario from '../ModalDetalleFuncionario';
import MiniCalendarioAusencia from '../PaginaCalendarioAusencias/MiniCalendarioAusencia';

const VistaDashboard = ({
    isMobile,
    detallesRef,
    mesActual,
    ausencias,
    feriadosSet,
    fechaSeleccionada,
    setFechaSeleccionada,
    mostrarModalEmpleado,
    empleadoSeleccionado,
    loading,
    error,
    detallesFechaSeleccionada,
    manejarMesAnterior,
    manejarMesSiguiente,
    manejarClicEmpleado,
    manejarCerrarModal
}) => {
    const renderizarMiniCalendario = (periodo) => (
        <MiniCalendarioAusencia periodo={periodo} feriadosSet={feriadosSet} />
    );

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-header">Calendario de Ausencias</h2>

            {loading && (
                <div className="loading-wrapper">
                    <div className="spinner-premium"></div>
                    <p className="mt-3 text-muted fw-medium">Sincronizando ausencias...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger border-0 shadow-sm rounded-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            {!loading && !error && (
                isMobile ? (
                    <PaginaCalendarioAusenciasMobile
                        mesActual={mesActual}
                        ausencias={ausencias}
                        fechaSeleccionada={fechaSeleccionada}
                        detallesFechaSeleccionada={detallesFechaSeleccionada}
                        manejarMesAnterior={manejarMesAnterior}
                        manejarMesSiguiente={manejarMesSiguiente}
                        manejarClicEmpleado={manejarClicEmpleado}
                        renderizarMiniCalendario={renderizarMiniCalendario}
                        mostrarModalEmpleado={mostrarModalEmpleado}
                        empleadoSeleccionado={empleadoSeleccionado}
                        manejarCerrarModal={manejarCerrarModal}
                    />
                ) : (
                    <CalendarioDashboard
                        mesActual={mesActual}
                        ausencias={ausencias}
                        fechaSeleccionada={fechaSeleccionada}
                        setFechaSeleccionada={setFechaSeleccionada}
                        manejarMesAnterior={manejarMesAnterior}
                        manejarMesSiguiente={manejarMesSiguiente}
                        detallesFechaSeleccionada={detallesFechaSeleccionada}
                        manejarClicEmpleado={manejarClicEmpleado}
                    />
                )
            )}

            {/* Anchor for scrolling to details */}
            <div ref={detallesRef}></div>

            {/* Employee Details Modal */}
            <ModalDetalleFuncionario
                empleadoSeleccionado={empleadoSeleccionado}
                mostrarModalEmpleado={mostrarModalEmpleado}
                manejarCerrarModal={manejarCerrarModal}
                renderizarMiniCalendario={renderizarMiniCalendario}
            />
        </div>
    );
};

export default VistaDashboard;