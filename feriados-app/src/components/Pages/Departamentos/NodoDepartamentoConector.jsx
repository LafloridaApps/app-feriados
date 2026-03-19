import PropTypes from 'prop-types';

const NodoDepartamentoConector = ({
    departamento,
    nodosExpandidos,
    onToggleNodo,
    onSeleccionarDepartamento,
    departamentoSeleccionado,
    depth,
}) => {
    const tieneDependencias = departamento.dependencias && departamento.dependencias.length > 0;
    const estaExpandido = nodosExpandidos[departamento.id] || false;
    const esDepartamentoSeleccionado = departamento?.id === departamentoSeleccionado?.id;

    const handleSeleccion = () => {
        onSeleccionarDepartamento(departamento);
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        if (tieneDependencias) {
            onToggleNodo(departamento.id);
        }
    };

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
                    />
                ))}
            </ul>
        );
    };

    return (
        <li className={nodeClasses}>
            <div className="tree-node-mejorado-content position-relative">
                <button
                    type="button"
                    className="position-absolute top-0 start-0 w-100 h-100 border-0 bg-transparent text-start"
                    onClick={handleSeleccion}
                    aria-label={`Seleccionar departamento ${departamento.nombre}`}
                    style={{ zIndex: 1 }}
                />

                {/* Botón visible para expandir/colapsar (por encima del botón invisible) */}
                <button
                    type="button"
                    className={`tree-toggler-mejorado ${estaExpandido ? 'expanded' : ''} ${tieneDependencias ? '' : 'invisible'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (tieneDependencias) handleToggle(e);
                    }}
                    style={{ visibility: tieneDependencias ? 'visible' : 'hidden', position: 'relative', zIndex: 2 }}
                    aria-label={estaExpandido ? "Colapsar nodo" : "Expandir nodo"}
                >
                    {tieneDependencias && (estaExpandido ? <i className="bi bi-dash"></i> : <i className="bi bi-plus"></i>)}
                </button>

                {/* Contenido visual de la fila */}
                <i className={`node-icon bi ${iconClass}`} style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }} aria-hidden="true"></i>

                <span className="flex-grow-1 text-truncate" title={departamento.nombre} style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }} aria-hidden="true">
                    {departamento.nombre}
                </span>
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
};

export default NodoDepartamentoConector;
