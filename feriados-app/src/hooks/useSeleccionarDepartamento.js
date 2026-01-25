import { useState } from 'react';

const useSeleccionarDepartamento = () => {
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);

    const handleSeleccionarDepartamento = (departamento) => {
        if (departamentoSeleccionado && departamentoSeleccionado.id === departamento.id) {
            setDepartamentoSeleccionado(null);
        } else {
            setDepartamentoSeleccionado(departamento);
        }
    };

    return {
        departamentoSeleccionado,
        handleSeleccionarDepartamento
    };
};

export default useSeleccionarDepartamento;
