import { useState, useEffect } from 'react';
import ArbolDepartamentos from './ArbolDepartamentos';
import DetallesJefe from './DetallesJefe';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDepartamentosList } from '../../../services/departamentosService';

const DepartamentosPage = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const response = await getDepartamentosList();
                if (Array.isArray(response.data)) {
                    setDepartamentos(response.data);
                } else {
                    console.error("Error: La respuesta de departamentos no es un array", response);
                    setError("Error al cargar los departamentos: La respuesta no tiene el formato esperado.");
                    setLoading(false);
                }
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        fetchDepartamentos();
    }, []);


    const handleSeleccionarDepartamento = (departamento) => {
        setDepartamentoSeleccionado(departamento);
    };

    if (loading) {
        return <div className="container mt-5"><p>Cargando departamentos...</p></div>;
    }

    if (error) {
        return <div className="container mt-5"><p className="text-danger">Error al cargar los departamentos: {error.message}</p></div>;
    }

    return (
        <div className="container mt-4t text-center">
            <h1 className='m-4'>Listado Departamentos</h1>
            <div className="row">
                <div className="col-md-6">
                    <ArbolDepartamentos
                        departamentos={departamentos}
                        onSeleccionarDepartamento={handleSeleccionarDepartamento}
                        departamentoSeleccionado={departamentoSeleccionado}
                    />
                </div>
                <div className="col-md-6">
                    <DetallesJefe departamento={departamentoSeleccionado} />
                </div>
            </div>
        </div>
    );
}

export default DepartamentosPage;