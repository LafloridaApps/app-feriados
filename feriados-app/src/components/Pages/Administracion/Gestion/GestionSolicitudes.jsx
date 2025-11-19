import React, { useState } from 'react';
import { useGestionSolicitudes } from '../../../../hooks/useGestionSolicitudes';
import MainDetailsCard from './components/MainDetailsCard';
import ActionsCard from './components/ActionsCard';
import TrazabilidadCard from './components/TrazabilidadCard';
import SearchSolicitud from './components/SearchSolicitud';
import './GestionSolicitudes.css';

export const GestionSolicitudes = () => {
    const [solicitudId, setSolicitudId] = useState('');
    const {
        solicitud, loading, error, editableData,
        buscarSolicitud, handleUpdateSolicitud, handleRepairUrl, handleInputChange
    } = useGestionSolicitudes();

    const handleSearch = (e) => {
        e.preventDefault();
        if (solicitudId) {
            buscarSolicitud(solicitudId);
        }
    };

    return (
        <div className="gestion-solicitudes-container">
            <SearchSolicitud
                solicitudId={solicitudId}
                setSolicitudId={setSolicitudId}
                handleSearch={handleSearch}
                loading={loading && !solicitud}
            />

            {error && <div className="alert alert-danger">{error}</div>}

            {solicitud && (
                <>
                    <MainDetailsCard solicitud={solicitud} />
                    <div className="content-grid">
                        <ActionsCard
                            solicitud={solicitud}
                            editableData={editableData}
                            handleInputChange={handleInputChange}
                            handleUpdateSolicitud={handleUpdateSolicitud}
                            handleRepairUrl={handleRepairUrl}
                            loading={loading}
                        />
                        <TrazabilidadCard derivaciones={solicitud.derivaciones} />
                    </div>
                </>
            )}
        </div>
    );
};