import { useState } from 'react';
import './ArbolDepartamentosMejorado.css'; // Importamos el CSS mejorado
import NodoDepartamentoConector from './NodoDepartamentoConector';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { updateDepartamentoById } from '../../../services/departamentosService'; // Corregido: Importar el servicio correcto

function ArbolDepartamentos({ departamentos, onSeleccionarDepartamento, departamentoSeleccionado, onShowCrearModal, fetchDepartamentos }) {

    const [nodosExpandidos, setNodosExpandidos] = useState({});

    const handleToggleNodo = (id) => {
        setNodosExpandidos(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const onEditarDepartamento = (id, nuevoNombre) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres cambiar el nombre del departamento a "${nuevoNombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Corregido: Usar el servicio y payload correctos para actualizar el nombre
                    await updateDepartamentoById(id, { nombre: nuevoNombre });
                    Swal.fire(
                        '¡Cambiado!',
                        `El nombre del departamento ha sido actualizado.`,
                        'success'
                    );
                    fetchDepartamentos(); // Refrescar el árbol
                } catch (error) {
                    Swal.fire(
                        'Error',
                        `Hubo un error al cambiar el nombre: ${error.message}`,
                        'error'
                    );
                }
            }
        });
    }

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
                    onEditarDepartamento={onEditarDepartamento}
                    onShowCrearModal={onShowCrearModal} // Pasar la nueva prop
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
    onShowCrearModal: PropTypes.func.isRequired, // Añadir a propTypes
    fetchDepartamentos: PropTypes.func.isRequired,
};