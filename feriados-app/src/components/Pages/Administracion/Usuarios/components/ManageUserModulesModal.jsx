import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { listarModulos } from '../../../../../services/moduloService';
import { guardarUsuario } from '../../../../../services/usuarioService';

const ManageUserModulesModal = ({ show, user, onClose, onSave }) => {
    const [availableModules, setAvailableModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);

    useEffect(() => {
        if (show) {
            listarModulos().then(setAvailableModules);
            setSelectedModules(user.modulos.map(m => m.id) || []);
        }
    }, [show, user]);

    const handleCheckboxChange = (moduleId) => {
        setSelectedModules(prev =>
            prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
        );
    };

    const handleSave = async () => {
        const dataToSend = {
            rut: user.rut,
            modulos: selectedModules.sort((a, b) => a - b)
        };

        try {
            await guardarUsuario(dataToSend);
            onSave({ ...user, modulos: selectedModules.map(id => ({ id })) });
            Swal.fire('Guardado', 'Los módulos del usuario han sido actualizados.', 'success');
            onClose();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar los cambios.', error.data);
        }
    };

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block': 'none' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Gestionar Módulos de {user.nombre}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <h6>Seleccione los módulos a los que tendrá acceso:</h6>
                        {availableModules.map(module => (
                            <div className="form-check" key={module.id}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={module.id}
                                    id={`module-${module.id}`}
                                    checked={selectedModules.includes(module.id)}
                                    onChange={() => handleCheckboxChange(module.id)}
                                />
                                <label className="form-check-label" htmlFor={`module-${module.id}`}>
                                    {module.nombre}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUserModulesModal;
