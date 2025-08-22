import React, { useState } from 'react';

const GestionDocumentos = () => {
    // Mocked state for existing templates
    const [templates, setTemplates] = useState([
        { id: 1, name: 'Plantilla_Decreto_Feriado_Legal.docx' },
        { id: 2, name: 'Plantilla_Permiso_Administrativo.docx' },
    ]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.docx'))) {
            setSelectedFile(file);
            setFeedbackMessage('');
        } else {
            setSelectedFile(null);
            setFeedbackMessage('Por favor, selecciona un archivo .docx');
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            setFeedbackMessage('No hay ningún archivo seleccionado.');
            return;
        }

        // Simulate API call and update UI
        console.log('Simulando subida del archivo:', selectedFile.name);
        // This is where you would call your API
        // await api.uploadTemplate(selectedFile);

        // On success, add to the list and give feedback
        const newTemplate = {
            id: templates.length + 3, // simple id generation
            name: selectedFile.name,
        };
        setTemplates(prev => [...prev, newTemplate]);
        setFeedbackMessage(`'${selectedFile.name}' subido con éxito.`);
        setSelectedFile(null); // Clear the input
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header">
                <h3>Gestión de Plantillas de Decretos</h3>
            </div>
            <div className="card-body">
                <div className="mb-4 p-3 border rounded">
                    <h5 className="mb-3">Subir Nueva Plantilla</h5>
                    <div className="input-group">
                        <input 
                            type="file" 
                            className="form-control" 
                            accept=".docx"
                            onChange={handleFileChange} 
                        />
                        <button 
                            className="btn btn-primary" 
                            onClick={handleUpload} 
                            disabled={!selectedFile}
                        >
                            Subir Plantilla
                        </button>
                    </div>
                    {feedbackMessage && <div className="form-text mt-2">{feedbackMessage}</div>}
                </div>

                <div>
                    <h5>Plantillas Existentes</h5>
                    <ul className="list-group">
                        {templates.map(template => (
                            <li key={template.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span><i className="bi bi-file-earmark-word-fill me-2"></i>{template.name}</span>
                                <button className="btn btn-outline-danger btn-sm">Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GestionDocumentos;
