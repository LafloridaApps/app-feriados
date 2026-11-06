import { useTemplates } from '../../../hooks/useTemplates';
import { useTemplateUpload } from '../../../hooks/useTemplateUpload';
import SubirPlantilla from './GestionDocumentos/SubirPlantilla';
import PlantillasExistentes from './GestionDocumentos/PlantillasExistentes';
import './GestionDocumentos.css';

const GestionDocumentos = () => {
    const { templates, handleDelete, handleView, fetchTemplates } = useTemplates();
    const cargaPlantilla = useTemplateUpload(fetchTemplates);

    return (
        <div className="gestion-documentos-container">
            <div className="gestion-documentos-card">
                <div className="gestion-documentos-card-header">
                    <h3>Gestión de Plantillas de Decretos</h3>
                </div>
                <div className="p-4">
                    <SubirPlantilla {...cargaPlantilla} />
                    <PlantillasExistentes templates={templates} handleView={handleView} handleDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
};

export default GestionDocumentos;
