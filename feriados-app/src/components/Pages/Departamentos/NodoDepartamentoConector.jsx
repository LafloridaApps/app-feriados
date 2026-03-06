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

    let iconClass = 'bi-file-earmark-text';
    if (depth === 0) {
        iconClass = 'bi-building';
    } else if (tieneDependencias) {
        iconClass = estaExpandido ? 'bi-folder2-open' : 'bi-folder2';
    }

    const nodeClasses = `tree-node-mejorado ${estaExpandido ? 'expanded' : ''} ${esDepartamentoSeleccionado ? 'active' : ''}`;

    const renderChildren = () => {
        if (!estaExpandido || !tieneDependencias) return null;
        return (
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
        );
    };

    return (
        <li className={nodeClasses}>
            <div className="tree-node-mejorado-content" onClick={handleSeleccion} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleSeleccion(); }}>
                <span
                    className={`tree-toggler-mejorado ${estaExpandido ? 'expanded' : ''} ${tieneDependencias ? '' : 'invisible'}`}
                    onClick={tieneDependencias ? handleToggle : null}
                    style={{ visibility: tieneDependencias ? 'visible' : 'hidden' }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' && tieneDependencias) handleToggle(e); }}
                >
                    {tieneDependencias && (estaExpandido ? <i className="bi bi-dash"></i> : <i className="bi bi-plus"></i>)}
                </span>

                <i className={`node-icon bi ${iconClass}`}></i>

                <span className="flex-grow-1 text-truncate" title={departamento.nombre}>
                    {enEdicion ? (
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={nombreEditado}
                            onChange={handleNombreChange}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
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
                                <button className="kebab-menu-item btn border-0 w-100 text-start" onClick={handleAddClick}>
                                    <i className="bi bi-plus-lg me-2"></i>Añadir sub-departamento
                                </button>
                                <button className="kebab-menu-item btn border-0 w-100 text-start" onClick={handleEditClick}>
                                    <i className="bi bi-pencil-fill me-2"></i>Editar nombre
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {renderChildren()}
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
