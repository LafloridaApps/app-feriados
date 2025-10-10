import { useState, useEffect, useCallback } from 'react';
import ArbolDepartamentos from './ArbolDepartamentos';
import DetallesJefe from './DetallesJefe';
import CrearDepartamentoModal from './CrearDepartamentoModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getDepartamentosList } from '../../../services/departamentosService';
import './ArbolDepartamentos.css';
import { getFuncionarioByRutAndVrut } from '../../../services/funcionarioService';

const DepartamentosPage = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [parentDepartment, setParentDepartment] = useState(null);
    const [jefeSeleccionado, setJefeSeleccionado] = useState(null);
    const [isJefeLoading, setIsJefeLoading] = useState(false);

    const fetchDepartamentos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getDepartamentosList();
            if (Array.isArray(response.data)) {
                setDepartamentos(response.data);
            } else {
                setError("La respuesta no tiene el formato esperado.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDepartamentos();
    }, [fetchDepartamentos]);

    const handleShowCrearModal = (parent) => {
        setParentDepartment(parent);
        setShowCrearModal(true);
    };

    const handleHideCrearModal = () => {
        setShowCrearModal(false);
        setParentDepartment(null);
    };


    useEffect(() => {
        const buscarJefe = async () => {
            if (departamentoSeleccionado && departamentoSeleccionado.rutJefe) {
                setIsJefeLoading(true);
                try {
                    const response = await getFuncionarioByRutAndVrut(departamentoSeleccionado.rutJefe);
                    setJefeSeleccionado(response); // Guardar el objeto completo
                } catch (error) {
                    console.error("Error al buscar los detalles del jefe:", error);
                    setJefeSeleccionado(null);
                } finally {
                    setIsJefeLoading(false);
                }
            } else {
                setJefeSeleccionado(null); // Limpiar el jefe si no hay depto seleccionado
            }
        };

        buscarJefe();
    }, [departamentoSeleccionado]);

    const handleSeleccionarDepartamento = (departamento) => {
        if (departamentoSeleccionado && departamentoSeleccionado.id === departamento.id) {
            setDepartamentoSeleccionado(null);
        } else {
            setDepartamentoSeleccionado(departamento);
        }
    };

    const filterTree = (nodes, term) => {
        if (!term) return nodes;
        const lowerCaseTerm = term.toLowerCase();
        function filter(node) {
            const children = (node.dependencias || []).map(filter).filter(Boolean);
            if (node.nombre.toLowerCase().includes(lowerCaseTerm) || children.length > 0) {
                return { ...node, dependencias: children };
            }
            return null;
        }
        return nodes.map(filter).filter(Boolean);
    };

    const departamentosFiltrados = filterTree(departamentos, searchTerm);

    if (error) {
        return <div className="container mt-5 alert alert-danger"><p>Error al cargar: {error}</p></div>;
    }

    return (
        <div className="container-fluid mt-4">
            <h2 className="mb-4">Gestión de Departamentos</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div className="input-group me-2">
                                <span className="input-group-text"><i className="bi bi-search"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar departamento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={() => handleShowCrearModal(null)} title="Crear departamento raíz">
                                <i className="bi bi-plus-lg"></i>
                            </button>
                        </div>
                        <div className="card-body scrollable-tree">
                            {loading ? (
                                <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>
                            ) : (
                                <ArbolDepartamentos
                                    departamentos={departamentosFiltrados}
                                    onSeleccionarDepartamento={handleSeleccionarDepartamento}
                                    departamentoSeleccionado={departamentoSeleccionado}
                                    onShowCrearModal={handleShowCrearModal}
                                    fetchDepartamentos={fetchDepartamentos}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Detalles del Departamento</h5>
                        </div>
                        <div className="card-body">
                            <DetallesJefe
                                departamento={departamentoSeleccionado}
                                fetchDepartamentos={fetchDepartamentos}
                                jefeSeleccionado={jefeSeleccionado}
                                isJefeLoading={isJefeLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <CrearDepartamentoModal
                show={showCrearModal}
                onHide={handleHideCrearModal}
                parent={parentDepartment}
                fetchDepartamentos={fetchDepartamentos}
            />
        </div>
    );
}

export default DepartamentosPage;
