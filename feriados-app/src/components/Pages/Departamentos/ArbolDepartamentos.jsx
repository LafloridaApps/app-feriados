import { useState } from 'react';
import './ArbolDepartamentos.css'; // Importamos el CSS
import NodoDepartamentoConector from './NodoDepartamentoConector';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { updateDepartamento } from '../../../services/departamentosService';

function ArbolDepartamentos({ departamentos, onSeleccionarDepartamento, departamentoSeleccionado }) {

    const [nodosExpandidos, setNodosExpandidos] = useState({});

    const handleToggleNodo = (id) => {
        setNodosExpandidos({
            ...nodosExpandidos,
            [id]: !nodosExpandidos[id],
        });
    };

    const onEditarDepartamento = (id, nuevoNombre) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres editar el departamento ${id} a ${nuevoNombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, editar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateDepartamento(id, nuevoNombre);
                    Swal.fire(
                        'Editado!',
                        `El departamento ${id} ha sido editado a ${nuevoNombre}.`,
                        'success'
                    );
                } catch (error) {
                    Swal.fire(
                        'Error',
                        `Hubo un error al editar el departamento ${id}: ${error.message}`,
                        'error'
                    );
                }
            }
        });
    }

    return (
        <ul className="tree-container">
            {Array.isArray(departamentos) && departamentos.map(departamento => (
                <NodoDepartamentoConector
                    key={departamento.id}
                    departamento={departamento}
                    nodosExpandidos={nodosExpandidos}
                    onToggleNodo={handleToggleNodo}
                    onSeleccionarDepartamento={onSeleccionarDepartamento}
                    departamentoSeleccionado={departamentoSeleccionado}
                    onEditarDepartamento={onEditarDepartamento}
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
};