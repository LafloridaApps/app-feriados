import { useState, useEffect, useCallback } from 'react';
import ArbolDepartamentos from './ArbolDepartamentos';
import DetallesJefe from './DetallesJefe';
import CrearDepartamentoModal from './CrearDepartamentoModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getDepartamentosList } from '../../../services/departamentosService';
import './ArbolDepartamentos.css';

const DepartamentosPage = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [parentDepartment, setParentDepartment] = useState(null);

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
        <div className="container-fluid mt-4 mb-5">
            {/* Page Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-1 text-primary fw-bold">Estructura Organizacional</h2>
                    <p className="text-muted mb-0">Gestione los departamentos y sus correspondientes jefaturas</p>
                </div>
                <div>
                    <button 
                        className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2" 
                        onClick={() => handleShowCrearModal(departamentoSeleccionado)} 
                        title={departamentoSeleccionado ? `Crear subdepartamento de ${departamentoSeleccionado.nombre}` : "Crear departamento raíz"}
                    >
                        <i className="bi bi-plus-circle fs-5"></i>
                        <span>Nuevo Departamento</span>
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Panel: Tree */}
                <div className="col-lg-5 col-md-12">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                            <h5 className="mb-3 text-secondary fw-semibold">Directorios</h5>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0 ps-0"
                                    placeholder="Buscar departamento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="card-body scrollable-tree mt-2">
                            {loading ? (
                                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                                    <output className="spinner-border text-primary mb-3"></output>
                                    <h6 className="text-secondary fw-semibold">Cargando datos...</h6>
                                </div>
                            ) : (
                                <ArbolDepartamentos
                                    departamentos={departamentosFiltrados}
                                    onSeleccionarDepartamento={handleSeleccionarDepartamento}
                                    departamentoSeleccionado={departamentoSeleccionado}
                                    fetchDepartamentos={fetchDepartamentos}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Details */}
                <div className="col-lg-7 col-md-12">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-3">
                            <h5 className="mb-0 text-secondary fw-semibold">
                                <i className="bi bi-info-circle me-2"></i>{" "}
                                Detalles y Jefatura
                            </h5>
                        </div>
                        <div className="card-body bg-light rounded m-3 mt-0 p-4">
                            {departamentoSeleccionado ? (
                                <DetallesJefe
                                    departamento={departamentoSeleccionado}
                                    fetchDepartamentos={fetchDepartamentos}
                                    setDepartamentoSeleccionado={setDepartamentoSeleccionado}
                                />
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-building fs-1 mb-3 d-block text-secondary opacity-50"></i>{" "}
                                    <h5>Seleccione un departamento</h5>
                                    <p>Haga clic en un departamento del árbol organizativo para ver o editar sus detalles y su respectiva jefatura.</p>
                                </div>
                            )}
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
