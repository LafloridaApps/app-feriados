import { useState } from 'react';
import RrhhTabs from './RRHHPage/RrhhTabs';
import RrhhTabPanel from './RRHHPage/RrhhTabPanel';
import { useGenerarDecretos } from '../../../hooks/useGenerarDecretos';
import { useConsultarDecretos } from '../../../hooks/useConsultarDecretos';
import { useAlertaSweetAlert } from '../../../hooks/useAlertaSweetAlert';
import { TemplateSelectionModal } from './TemplateSelectionModal';
import './RRHHPage.css'; // Importar el archivo CSS personalizado

const RRHHPage = () => {
    const [activeTab, setActiveTab] = useState('generar');
    const { mostrarAlertaError } = useAlertaSweetAlert();

    const generarDecretos = useGenerarDecretos();
    const consultarDecretos = useConsultarDecretos(mostrarAlertaError);

    return (
        <div className="container-fluid rrhh-page-container pb-5">
            {/* Standardized Premium Header */}
            <div className="premium-header mb-4">
                <div className="d-flex align-items-center gap-3">
                    <div className="header-icon-hex">
                        <i className="bi bi-briefcase-fill"></i>
                    </div>
                    <div>
                        <h2 className="mb-0 fw-bold text-dark">Gestión de Decretos</h2>
                        <p className="text-muted mb-0">Portal Administrativo de Recursos Humanos</p>
                    </div>
                </div>
            </div>

            <RrhhTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <RrhhTabPanel
                activeTab={activeTab}
                generarDecretos={generarDecretos}
                consultarDecretos={consultarDecretos}
            />
            <TemplateSelectionModal
                show={generarDecretos.showTemplateModal}
                onHide={() => generarDecretos.setShowTemplateModal(false)}
                templates={generarDecretos.templates}
                selectedTemplate={generarDecretos.selectedTemplate}
                onTemplateChange={generarDecretos.setSelectedTemplate}
                onConfirm={generarDecretos.handleGenerarDecreto}
            />
        </div>
    );
};

export default RRHHPage;
