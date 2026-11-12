import { useState, useEffect, useRef } from 'react';
import './ArbolDepartamentosMejorado.css'; // Importamos el CSS mejorado
import NodoDepartamentoConector from './NodoDepartamentoConector';
import PropTypes from 'prop-types';

function ArbolDepartamentos({ departamentos, onSeleccionarDepartamento, departamentoSeleccionado, searchActive = false, onCrearDependencia }) {

    const [menu, setMenu] = useState(null);
    const menuButton = useRef(null);
    useEffect(() => {
        if (!menu) return;
        menuButton.current?.focus();
        const cerrar = () => setMenu(null);
        const teclado = (event) => {
            if (event.key === 'Escape') {
                menu.trigger.focus();
                cerrar();
            }
            if (event.key === 'Tab') cerrar();
        };
        document.addEventListener('click', cerrar);
        document.addEventListener('keydown', teclado);
        window.addEventListener('scroll', cerrar, true);
        window.addEventListener('resize', cerrar);
        return () => {
            document.removeEventListener('click', cerrar);
            document.removeEventListener('keydown', teclado);
            window.removeEventListener('scroll', cerrar, true);
            window.removeEventListener('resize', cerrar);
        };
    }, [menu]);

    const abrirMenu = (event, departamento) => {
        event.preventDefault();
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.type === 'keydown' ? rect.left : event.clientX;
        const y = event.type === 'keydown' ? rect.bottom : event.clientY;
        setMenu({ departamento, trigger: event.currentTarget,
            x: Math.max(8, Math.min(x, window.innerWidth - 260)),
            y: Math.max(8, Math.min(y, window.innerHeight - 100)) });
    };

    const [nodosExpandidos, setNodosExpandidos] = useState({});

    const handleToggleNodo = (id) => {
        setNodosExpandidos(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const expanded = { ...nodosExpandidos };
    const reveal = (nodes) => {
        let found = false;
        nodes.forEach(node => {
            const childSelected = reveal(node.dependencias || []);
            if (searchActive || childSelected) expanded[node.id] = true;
            if (node.id === departamentoSeleccionado?.id || childSelected) found = true;
        });
        return found;
    };
    reveal(departamentos);
    return (
        <>
        <ul className="tree-container-mejorado">
            {Array.isArray(departamentos) && departamentos.map(departamento => (
                <NodoDepartamentoConector
                    key={departamento.id}
                    departamento={departamento}
                    nodosExpandidos={expanded}
                    onContextMenu={abrirMenu}
                    onToggleNodo={handleToggleNodo}
                    onSeleccionarDepartamento={onSeleccionarDepartamento}
                    departamentoSeleccionado={departamentoSeleccionado}
                    depth={0} // Nivel inicial de profundidad
                />
            ))}
        </ul>
        {menu && <div className="departamentos-context-menu" role="menu" aria-label={`Acciones de ${menu.departamento.nombre}`} style={{ left: menu.x, top: menu.y }}>
            <span className="departamentos-context-title">{menu.departamento.nombre}</span>
            <button ref={menuButton} type="button" role="menuitem" onClick={() => {
                onCrearDependencia(menu.departamento);
                setMenu(null);
            }}><i className="bi bi-plus-circle me-2" aria-hidden="true"></i>Agregar dependencia</button>
        </div>}
        </>
    );
}

export default ArbolDepartamentos;

ArbolDepartamentos.propTypes = {
    onCrearDependencia: PropTypes.func.isRequired,
    searchActive: PropTypes.bool,
    departamentos: PropTypes.array.isRequired,
    onSeleccionarDepartamento: PropTypes.func.isRequired,
    departamentoSeleccionado: PropTypes.object,
};