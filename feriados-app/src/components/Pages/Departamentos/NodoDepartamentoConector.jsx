import PropTypes from 'prop-types';
import { useState } from 'react';

const NodoDepartamentoConector = ({
    departamento,
    nodosExpandidos,
    onToggleNodo,
    onSeleccionarDepartamento,
    departamentoSeleccionado,
    depth,
    onEditarDepartamento,
}) => {
    const [enEdicion, setEnEdicion] = useState(false);
    const [nombreEditado, setNombreEditado] = useState(departamento.nombre);
    const tieneDependencias = departamento.dependencias && departamento.dependencias.length > 0;
    const estaExpandido = nodosExpandidos[departamento.id] || false;
    const esDepartamentoSeleccionado = departamento?.id === departamentoSeleccionado?.id;

    const handleSeleccion = () => {
        onSeleccionarDepartamento(departamento);
    };

    const handleToggle = (e) => {
        e.stopPropagation(); // Evita que el clic se propague al contenedor del nodo
        if (tieneDependencias) {
            onToggleNodo(departamento.id);
        }
    };

    const handleEditarClick = (e) => {
        e.stopPropagation();
        setEnEdicion(true);
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

    const nodeClasses = `tree-node-mejorado ${estaExpandido ? 'expanded' : ''} ${esDepartamentoSeleccionado ? 'active' : ''}`;

    return (
        <li className={nodeClasses}>
            <div className="tree-node-mejorado-content" onClick={handleSeleccion}>
                {tieneDependencias && (
                    <span
                        className={`tree-toggler-mejorado ${estaExpandido ? 'expanded' : ''}`}
                        onClick={handleToggle}
                    />
                )}
                <span style={{ marginLeft: tieneDependencias ? '5px' : '25px' }}>
                    {enEdicion ? (
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            value={nombreEditado}
                            onChange={handleNombreChange}
                            onClick={(e) => e.stopPropagation()} // Evita que se seleccione al hacer clic en el input
                        />
                    ) : (
                        departamento.nombre
                    )}
                </span>
                {esDepartamentoSeleccionado && !enEdicion && (
                    <button
                        className="btn btn-sm btn-light ms-auto"
                        onClick={handleEditarClick}
                    >
                        <i className="bi bi-pencil-fill"></i>
                    </button>
                )}
                {enEdicion && (
                    <div className="ms-auto">
                        <button className="btn btn-sm btn-success me-1" onClick={handleGuardarEdicion}>
                            <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={handleCancelarEdicion}>
                            <i className="bi bi-x-lg"></i>
                        </button>
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
};

export default NodoDepartamentoConector;
