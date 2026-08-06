import { useState, useMemo, useEffect } from 'react';
import FiltrosSolicitudes from './FiltroSolicitudes';
import InboxHeader from './InboxHeader';
import InboxTable from './InboxTable';
import InboxMobileList from './InboxMobileList';
import AnalisisCobertura from './AnalisisCobertura';
import InboxPagination from './InboxPagination';
import InformesTab from './InformesTab';
import { useInboxSolicitudes } from '../../../hooks/useInboxSolicitudes';
import { useTraslapes } from '../../../hooks/useTraslapes';
import './Inbox.css';

const InboxSolicitudes = () => {
    const [activeTab, setActiveTab] = useState('inbox');
    const {
        isMobile,
        rutFuncionario,
        currentPage,
        totalPages,
        totalElements,
        isSubrogante,
        detalleAbiertoId,
        handleVerDetalleClick,
        handleActualizarSolicitud,
        handleFiltrarSolicitudes,
        handlePageChange,
        sortedItems,
        handlerEntrada,
        handlerVisar,
        handlerAprobar,
        noLeidas,
        setNoLeidas,
        anioFiltro,
        setAnioFiltro,
        aniosDisponibles,
        modoBusqueda,
    } = useInboxSolicitudes();

    const itemsToDisplay = useMemo(() => {
        if (modoBusqueda || !noLeidas) return sortedItems;
        return sortedItems.filter(solicitud => {
            const derivacionActiva = solicitud.derivaciones?.[0];
            const estado = (solicitud.estadoSolicitud || '').trim().toUpperCase();
            return derivacionActiva?.recepcionada === false && estado !== 'ANULADA' && estado !== 'RECHAZADA';
        });
    }, [sortedItems, noLeidas]);

    const traslapes = useTraslapes(sortedItems);

    const handleAnioChange = (e) => {
        setAnioFiltro(e.target.value);
        handlePageChange(0);
    };

    useEffect(() => {
        setActiveTab(prev => isMobile ? 'inbox' : prev);
    }, [isMobile]);

    return (
        <div className="container-fluid mt-4">
            <FiltrosSolicitudes onFiltrar={handleFiltrarSolicitudes} />
            {!modoBusqueda && (
                <div className="d-flex justify-content-end mb-2">
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="anioSelect" className="form-label mb-0 text-muted small fw-semibold">
                            <i className="bi bi-calendar-date me-1"></i>Año
                        </label>
                        <select
                            id="anioSelect"
                            className="form-select form-select-sm"
                            style={{ width: '100px' }}
                            value={anioFiltro}
                            onChange={handleAnioChange}
                        >
                            {aniosDisponibles.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <InboxHeader
                            isSubrogante={isSubrogante}
                            noLeidas={noLeidas}
                            setNoLeidas={setNoLeidas}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            traslapesCount={traslapes.length}
                            isMobile={isMobile}
                            modoBusqueda={modoBusqueda}
                        />
                        <div className="card-body p-0">
                            {(activeTab === 'inbox' || isMobile) && (
                                <>
                                    <InboxTable
                                        itemsToDisplay={itemsToDisplay}
                                        rutFuncionario={rutFuncionario}
                                        handleActualizarSolicitud={handleActualizarSolicitud}
                                        handlerEntrada={handlerEntrada}
                                        handlerVisar={handlerVisar}
                                        handlerAprobar={handlerAprobar}
                                        detalleAbiertoId={detalleAbiertoId}
                                        handleVerDetalleClick={handleVerDetalleClick}
                                    />
                                    {isMobile && (
                                        <InboxMobileList
                                            itemsToDisplay={itemsToDisplay}
                                            detalleAbiertoId={detalleAbiertoId}
                                            handlerEntrada={handlerEntrada}
                                            handlerVisar={handlerVisar}
                                            handlerAprobar={handlerAprobar}
                                            rutFuncionario={rutFuncionario}
                                            handleActualizarSolicitud={handleActualizarSolicitud}
                                            handleVerDetalleClick={handleVerDetalleClick}
                                        />
                                    )}
                                </>
                            )}
                            {!isMobile && activeTab === 'traslapes' && (
                                <AnalisisCobertura traslapes={traslapes} />
                            )}
                            {!isMobile && activeTab === 'informes' && (
                                <div className="p-4 bg-white" style={{ minHeight: '400px' }}>
                                    <InformesTab />
                                </div>
                            )}
                        </div>
                        {(activeTab === 'inbox' || isMobile) && (
                            <InboxPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalElements={totalElements}
                                itemsToDisplay={itemsToDisplay}
                                handlePageChange={handlePageChange}
                                isMobile={isMobile}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InboxSolicitudes;