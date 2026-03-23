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
            <dialog open className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', outline: 'none', padding: 0 }} >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                        <div className="modal-header border-bottom-0 pt-4 px-4">
                            <h5 className="modal-title fw-bold text-dark d-flex align-items-center">
                                <i className="bi bi-file-earmark-richtext me-2 text-primary"></i> Plantilla de Decreto
                            </h5>
                            <button type="button" className="btn-close shadow-none" onClick={onHide} aria-label="Close"></button>
                        </div>
                        <div className="modal-body px-4 py-3">
                            {templates.length > 0 ? (
                                <div>
                                    <label htmlFor="templateSelect" className="form-label-premium mb-3">
                                        Seleccione la plantilla base para la generación de los documentos:
                                    </label>
                                    <div className="input-group-premium">
                                        <select
                                            id="templateSelect"
                                            className="form-select form-control-premium"
                                            value={selectedTemplate}
                                            onChange={(e) => onTemplateChange(e.target.value)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {templates.map((template) => (
                                                <option key={template.id} value={template.nombre}>
                                                    {template.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <p className="mt-3 text-muted small">
                                        <i className="bi bi-info-circle me-1"></i> Esta plantilla se utilizará para todos los decretos seleccionados en el paso anterior.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="bi bi-exclamation-triangle text-warning display-4 mb-3"></i>
                                    <h5>No hay plantillas</h5>
                                    <p className="text-muted">Por favor, suba una plantilla en la sección de parámetros.</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer border-top-0 pb-4 px-4">
                            <button type="button" className="btn btn-light px-4 py-2 fw-600 rounded-12" onClick={onHide}>
                                Cancelar
                            </button>
                             <button 
                                 type="button" 
                                 className="btn btn-premium px-4 py-2 shadow-sm"
                                 onClick={handleConfirm} 
                                 disabled={templates.length === 0 || !selectedTemplate}
                             >
                                 <i className="bi bi-check-circle me-2"></i> Confirmar y Generar
                             </button>
                        </div>
                    </div>
                </div>
            </dialog>
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