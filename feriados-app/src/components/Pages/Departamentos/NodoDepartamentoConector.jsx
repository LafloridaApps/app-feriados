import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

const NodoDepartamentoConector = ({
    departamento,
    nodosExpandidos,
    onToggleNodo,
    onSeleccionarDepartamento,
    departamentoSeleccionado,
    depth,
    onEditarDepartamento,
    onShowCrearModal,
}) => {
    const [enEdicion, setEnEdicion] = useState(false);
    const [nombreEditado, setNombreEditado] = useState(departamento.nombre);
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);

    const tieneDependencias = departamento.dependencias && departamento.dependencias.length > 0;
    const estaExpandido = nodosExpandidos[departamento.id] || false;
    const esDepartamentoSeleccionado = departamento?.id === departamentoSeleccionado?.id;

    // Cerrar menú si se hace clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleSeleccion = () => {
        onSeleccionarDepartamento(departamento);
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        if (tieneDependencias) {
            onToggleNodo(departamento.id);
        }
    };

    const handleGuardarEdicion = (e) => {
        e.stopPropagation();
        onEditarDepartamento(departamento.id, nombreEditado);
        setEnEdicion(false);
    };

    const handleCancelarEdicion = (e) => {
        e.stopPropagation();
        setNombreEditado(departamento.nombre);
        setEnEdicion(false);
    };

    const handleNombreChange = (e) => {
        setNombreEditado(e.target.value);
    };

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setMenuVisible(!menuVisible);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setEnEdicion(true);
        setMenuVisible(false);
    }

    const handleAddClick = (e) => {
        e.stopPropagation();
        onShowCrearModal(departamento);
        setMenuVisible(false);
    }

    const nodeClasses = `tree-node-mejorado ${estaExpandido ? 'expanded' : ''} ${esDepartamentoSeleccionado ? 'active' : ''}`;

    return (
        <li className={nodeClasses}>
            <div className="tree-node-mejorado-content" onClick={handleSeleccion}>
                                <span
                    className={`tree-toggler-mejorado ${estaExpandido ? 'expanded' : ''}`}
                    onClick={tieneDependencias ? handleToggle : null}
                >
                    {tieneDependencias && (estaExpandido ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chevron-right"></i>)}
                </span>
                <span style={{ marginLeft: '5px' }}>
                    {enEdicion ? (
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={nombreEditado}
                            onChange={handleNombreChange}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        departamento.nombre
                    )}
                </span>

                {/* --- Botones de edición y menú --- */}
                {enEdicion ? (
                    <div className="ms-auto">
                        <button className="btn btn-sm btn-success me-1" onClick={handleGuardarEdicion} title="Guardar">
                            <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={handleCancelarEdicion} title="Cancelar">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                ) : esDepartamentoSeleccionado && (
                    <div className="ms-auto position-relative" ref={menuRef}>
                        <button
                            className="btn btn-sm btn-light"
                            onClick={handleMenuToggle}
                            title="Opciones"
                        >
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>

                        {menuVisible && (
                            <div className="kebab-menu">
                                <div className="kebab-menu-item" onClick={handleAddClick}>
                                    <i className="bi bi-plus-lg me-2"></i>Añadir sub-departamento
                                </div>
                                <div className="kebab-menu-item" onClick={handleEditClick}>
                                    <i className="bi bi-pencil-fill me-2"></i>Editar nombre
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {estaExpandido && tieneDependencias && (
                <ul className="tree-children-mejorado">
                    {departamento.dependencias.map(dep => (
                        <NodoDepartamentoConector
                            key={dep.id}
                            departamento={dep}
                            nodosExpandidos={nodosExpandidos}
                            onToggleNodo={onToggleNodo}
                            onSeleccionarDepartamento={onSeleccionarDepartamento}
                            departamentoSeleccionado={departamentoSeleccionado}
                            depth={depth + 1}
                            onEditarDepartamento={onEditarDepartamento}
                            onShowCrearModal={onShowCrearModal}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

NodoDepartamentoConector.propTypes = {
    departamento: PropTypes.object.isRequired,
    nodosExpandidos: PropTypes.object.isRequired,
    onToggleNodo: PropTypes.func.isRequired,
    onSeleccionarDepartamento: PropTypes.func.isRequired,
    departamentoSeleccionado: PropTypes.object,
    depth: PropTypes.number.isRequired,
    onEditarDepartamento: PropTypes.func.isRequired,
    onShowCrearModal: PropTypes.func.isRequired,
};

export default NodoDepartamentoConector;
