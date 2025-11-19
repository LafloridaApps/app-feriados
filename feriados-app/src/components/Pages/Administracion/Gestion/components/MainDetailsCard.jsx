import React from 'react';

const MainDetailsCard = ({ solicitud }) => {
    const handlePdfClick = () => {
        if (solicitud.urlPdf) {
            // Clean the URL by removing any newline/carriage return characters and trimming whitespace
            const cleanedUrl = solicitud.urlPdf.replace(/(\r\n|\n|\r)/gm, "").trim();
            window.open(cleanedUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="main-details-card">
            {solicitud.urlPdf && (
                <button onClick={handlePdfClick} className="btn btn-light pdf-button">
                    <i className="bi bi-file-earmark-pdf"></i> Ver PDF
                </button>
            )}
            <div className="main-details-grid">
                <div className="main-detail-item">
                    <h5><i className="bi bi-person-fill me-2"></i>Funcionario</h5>
                    <p>{solicitud.nombreFuncionario}</p>
                </div>
                <div className="main-detail-item">
                    <h5><i className="bi bi-calendar-plus me-2"></i>Fecha de Solicitud</h5>
                    <p>{new Date(solicitud.fechaCreacion).toLocaleDateString()}</p>
                </div>
                 <div className="main-detail-item">
                    <h5><i className="bi bi-clock me-2"></i>Duracion</h5>
                    <p>{solicitud.cantidadDias}</p>
                </div>
                <div className="main-detail-item">
                    <h5><i className="bi bi-flag-fill me-2"></i>Estado</h5>
                    <p><span className={`status-badge status-${solicitud.estadoSolicitud}`}>{solicitud.estadoSolicitud}</span></p>
                </div>
            </div>
        </div>
    );
};

export default MainDetailsCard;
