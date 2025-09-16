import { useState } from 'react';
import Swal from 'sweetalert2';
import { getFuncionarioByRutAndVrut } from '../services/funcionarioService';
import { validarRut } from '../services/utils';

export const useFuncionarioSearch = () => {
    const [rut, setRut] = useState('');
    const [rutSinDV, setRutSinDV] = useState('');
    const [nombre, setNombre] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [idDepto, setIdDepto] = useState(null);

    const handleRutChange = (e) => {
        const valorFiltrado = e.target.value.replace(/[^0-9kK-]/g, '');
        setRut(valorFiltrado);
    };

    const reset = () => {
        setRut('');
        setRutSinDV('');
        setNombre('');
        setDepartamento('');
        setIdDepto(null);
    };

    const handleBuscar = async () => {
        const rutLimpio = rut.replace(/[.-]/g, '');
        
        if (!rutLimpio) {
            Swal.fire({ icon: 'warning', title: 'Campo Vacío', text: 'Por favor, ingrese un RUT.' });
            return;
        }

        if (!validarRut(rutLimpio)) {
            Swal.fire({ icon: 'error', title: 'RUT Inválido', text: 'El RUT ingresado no es válido.' });
            reset(); // Limpiar en caso de error
            return;
        }

        const rutParaApi = rutLimpio.slice(0, -1);
        setRutSinDV(rutParaApi);

        try {
            const data = await getFuncionarioByRutAndVrut(rutParaApi);
            if (data) {
                const nombreCompleto = `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
                setNombre(nombreCompleto);
                setDepartamento(data.departamento || 'Sin departamento');
                setIdDepto(data.codDepto || null);
            } else {
                Swal.fire({ icon: 'error', title: 'No Encontrado', text: 'Funcionario no encontrado con el RUT proporcionado.' });
                reset();
            }
        } catch (err) {
            console.error("Error al buscar funcionario:", err);
            Swal.fire({ icon: 'error', title: 'Error de Red', text: 'No se pudo realizar la búsqueda.' });
            reset();
        }
    };

    return {
        rut,
        rutSinDV,
        nombre,
        departamento,
        idDepto,
        handleRutChange,
        handleBuscar,
        reset // Exportar la función reset
    };
};