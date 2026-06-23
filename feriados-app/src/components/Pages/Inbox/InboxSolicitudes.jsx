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
        requestSort,
        sortConfig,
        sortedItems,
        handlerEntrada,
        handlerVisar,
        handlerAprobar,
        noLeidas,
        setNoLeidas
    } = useInboxSolicitudes();

    const itemsToDisplay = useMemo(() => {
        if (!noLeidas) return sortedItems;
        return sortedItems.filter(solicitud => {
            const derivacionActiva = solicitud.derivaciones?.[0];
            const estado = (solicitud.estadoSolicitud || '').trim().toUpperCase();
            return derivacionActiva?.recepcionada === false && estado !== 'ANULADA' && estado !== 'RECHAZADA';
        });
    }, [sortedItems, noLeidas]);

    const traslapes = useTraslapes(sortedItems);

    useEffect(() => {
        if (isMobile) {
            setActiveTab('inbox');
        }
    }, [isMobile]);

    return (
        <div className="container-fluid mt-4">
            <FiltrosSolicitudes onFiltrar={handleFiltrarSolicitudes} />
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
                        />
                        <div className="card-body p-0">
                            {(activeTab === 'inbox' || isMobile) && (
                                <>
                                    <InboxTable
                                        itemsToDisplay={itemsToDisplay}
                                        sortConfig={sortConfig}
                                        requestSort={requestSort}
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