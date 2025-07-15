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
    const paddingLeft = depth * 20;
    const esDepartamentoSeleccionado = departamento?.id === departamentoSeleccionado?.id;

    const handleSeleccion = () => {
        onSeleccionarDepartamento(departamento);
    };

    const handleToggle = () => {
        if (tieneDependencias) {
            onToggleNodo(departamento.id);
        }
    };

    const handleEditarClick = () => {
        setEnEdicion(true);
    };

    const handleGuardarEdicion = () => {
        onEditarDepartamento(departamento.id, nombreEditado);
        setEnEdicion(false);
    };

    const handleCancelarEdicion = () => {
        setNombreEditado(departamento.nombre);
        setEnEdicion(false);
    };

    const handleNombreChange = (e) => {
        setNombreEditado(e.target.value);
    };

    return (
        <li className={`tree-node ${esDepartamentoSeleccionado ? 'active' : ''}`} style={{ paddingLeft: `${paddingLeft}px` }}>
            <div className="d-flex align-items-center">
                {tieneDependencias ? (
                    <button
                        className={`bi ${estaExpandido ? 'bi-chevron-down' : 'bi-chevron-right'} me-2 btn btn-link p-0 align-items-center justify-content-center`}
                        style={{ cursor: 'pointer', fontSize: '1rem', border: 'none', outline: 'none' }}
                        onClick={handleToggle}
                        aria-expanded={estaExpandido}
                        aria-label={`${estaExpandido ? 'Contraer' : 'Expandir'} ${departamento.nombre}`}
                    />
                ) : (
                    <span className="me-2" style={{ width: '1em' }}></span>
                )}
                {enEdicion ? (
                    <>
                        <input
                            type="text"
                            className="form-control form-control-sm me-2"
                            value={nombreEditado}
                            onChange={handleNombreChange}
                        />
                        <button className="btn btn-sm btn-success me-1" onClick={handleGuardarEdicion}>
                            <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={handleCancelarEdicion}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0, outline: 'none', textAlign: 'left', marginRight: '5px' }}
                            onClick={handleSeleccion}
                            aria-label={`Seleccionar ${departamento.nombre}`}
                        >
                            {departamento.nombre}
                        </button>
                        <span className="ms-1" style={{ fontSize: '0.8rem', color: '#6c757d' }}>({departamento.nivel})</span>
                        {esDepartamentoSeleccionado && (
                            <button
                                className="btn btn-sm btn-outline-primary ms-2"
                                onClick={handleEditarClick}
                                aria-label={`Editar nombre de ${departamento.nombre}`}
                            >
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                        )}
                    </>
                )}
            </div>
            {estaExpandido && tieneDependencias && (
                <ul className="tree-children">
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
    departamento: PropTypes.shape({
        id: PropTypes.any.isRequired,
        nombre: PropTypes.string.isRequired,
        nivel: PropTypes.string.isRequired,
        dependencias: PropTypes.array,
        [PropTypes.string]: PropTypes.any, 
    }).isRequired,
    nodosExpandidos: PropTypes.object.isRequired,
    onToggleNodo: PropTypes.func.isRequired,
    onSeleccionarDepartamento: PropTypes.func.isRequired,
    departamentoSeleccionado: PropTypes.shape({
        id: PropTypes.any,
        [PropTypes.string]: PropTypes.any, 
    }),
    depth: PropTypes.number.isRequired,
    onEditarDepartamento: PropTypes.func.isRequired, 
};

export default NodoDepartamentoConector;