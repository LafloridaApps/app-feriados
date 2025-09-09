import React from 'react';
import PropTypes from 'prop-types';

export const TemplateSelectionModal = ({ show, onHide, templates, selectedTemplate, onTemplateChange, onConfirm }) => {

    if (!show) {
        return null;
    }

    const handleConfirm = () => {
        onConfirm(selectedTemplate);
    };

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Seleccionar Plantilla de Decreto</h5>
                            <button type="button" className="btn-close" onClick={onHide} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {templates.length > 0 ? (
                                <div className="mb-3">
                                    <label htmlFor="templateSelect" className="form-label">Por favor, elija la plantilla que desea utilizar para generar los decretos.</label>
                                    <select
                                        id="templateSelect"
                                        className="form-select"
                                        value={selectedTemplate}
                                        onChange={(e) => onTemplateChange(e.target.value)}
                                    >
                                        {templates.map((template) => (
                                            <option key={template.id} value={template.nombre}>
                                                {template.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <p>No hay plantillas disponibles. Por favor, suba una plantilla en la sección de parámetros.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={handleConfirm} 
                                disabled={templates.length === 0 || !selectedTemplate}
                            >
                                Confirmar y Generar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

TemplateSelectionModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    templates: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any.isRequired,
        nombre: PropTypes.string.isRequired,
    })).isRequired,
    selectedTemplate: PropTypes.string.isRequired,
    onTemplateChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};