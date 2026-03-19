import { useState } from 'react';
import './ArbolDepartamentosMejorado.css'; // Importamos el CSS mejorado
import NodoDepartamentoConector from './NodoDepartamentoConector';
import PropTypes from 'prop-types';

function ArbolDepartamentos({ departamentos, onSeleccionarDepartamento, departamentoSeleccionado, fetchDepartamentos }) {

    const [nodosExpandidos, setNodosExpandidos] = useState({});

    const handleToggleNodo = (id) => {
        setNodosExpandidos(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <ul className="tree-container-mejorado">
            {Array.isArray(departamentos) && departamentos.map(departamento => (
                <NodoDepartamentoConector
                    key={departamento.id}
                    departamento={departamento}
                    nodosExpandidos={nodosExpandidos}
                    onToggleNodo={handleToggleNodo}
                    onSeleccionarDepartamento={onSeleccionarDepartamento}
                    departamentoSeleccionado={departamentoSeleccionado}
                    depth={0} // Nivel inicial de profundidad
                />
            ))}
        </ul>
    );
}

export default ArbolDepartamentos;

ArbolDepartamentos.propTypes = {
    departamentos: PropTypes.array.isRequired,
    onSeleccionarDepartamento: PropTypes.func.isRequired,
    departamentoSeleccionado: PropTypes.object,
    fetchDepartamentos: PropTypes.func.isRequired,
};