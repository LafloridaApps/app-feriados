import { useState, useEffect, useCallback } from 'react';
import ArbolDepartamentos from './ArbolDepartamentos';
import DetallesJefe from './DetallesJefe';
import CrearDepartamentoModal from './CrearDepartamentoModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getDepartamentosList } from '../../../services/departamentosService';
import './ArbolDepartamentos.css';

const flattenTree = (nodes) => nodes.flatMap(node => [node, ...flattenTree(node.dependencias || [])]);

const DepartamentosPage = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [parentDepartment, setParentDepartment] = useState(null);

    const fetchDepartamentos = useCallback(async (creado) => {
        try {
            setError(null);
            const response = await getDepartamentosList();
            if (Array.isArray(response.data)) {
                setDepartamentos(response.data);
                setDepartamentoSeleccionado(actual => {
                    const nodes = flattenTree(response.data);
                    if (creado) {
                        const padre = creado.idPadre == null ? null : nodes.find(node => node.id === creado.idPadre);
                        const candidatos = padre ? padre.dependencias || [] : response.data;
                        return candidatos.find(node => !creado.idsAnteriores.includes(node.id) && node.nombre === creado.nombreDepartamento) || actual;
                    }
                    return nodes.find(node => node.id === actual?.id) || null;
                });
                if (creado) setSearchTerm('');
                return true;
            } else {
                throw new TypeError("La respuesta no tiene el formato esperado.");
            }
        } catch (error) {
            setError(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchDepartamentos();
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
        const lowerCaseTerm = term.trim().toLocaleLowerCase();
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




    return (
        <div className="container-fluid mt-4 mb-5 departamentos-page">
            <header className="departamentos-header mb-4">
                <div className="d-flex align-items-center gap-3">
                    <span className="departamentos-header-icon"><i className="bi bi-diagram-3" aria-hidden="true"></i></span>
                    <div>
                        <span className="departamentos-eyebrow">ADMINISTRACIÓN</span>
                        <h2 className="mb-1 fw-bold">Departamentos</h2>
                        <p className="text-muted mb-0">Organice la estructura y gestione las jefaturas de su institución.</p>
                    </div>
                </div>
                <button className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2"
                    onClick={() => handleShowCrearModal(null)}>
                    <i className="bi bi-plus-lg" aria-hidden="true"></i> Nuevo departamento raíz
                </button>
            </header>
            {error && <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                <span>No se pudo actualizar el árbol: {error}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={() => void fetchDepartamentos()}>Reintentar</button>
            </div>}
            <div className="row g-4">
                {/* Left Panel: Tree */}
                <div className="col-lg-5 col-md-12">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                            <h5 className="mb-3 text-secondary fw-semibold">Estructura organizacional</h5>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0 ps-0"
                                    aria-label="Buscar departamento"
                                    placeholder="Buscar departamento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && <button className="btn btn-light border" aria-label="Limpiar búsqueda" onClick={() => setSearchTerm('')}><i className="bi bi-x-lg" aria-hidden="true"></i></button>}
                            </div>
                            <p className="small text-muted mt-3 mb-2">Use + y − para explorar. Clic derecho sobre una unidad para agregar una dependencia.</p>
                        </div>
                        <div className="card-body scrollable-tree mt-2">
                            {loading && departamentos.length === 0 ? (
                                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                                    <output className="spinner-border text-primary mb-3"></output>
                                    <h6 className="text-secondary fw-semibold">Cargando datos...</h6>
                                </div>
                            ) : (
                                <>
                                {departamentosFiltrados.length === 0 && <p className="text-muted text-center py-4">{searchTerm ? "No hay departamentos que coincidan con la búsqueda." : "Aún no hay departamentos. Cree el primero para comenzar."}</p>}
                                <ArbolDepartamentos
                                    onCrearDependencia={handleShowCrearModal}
                                    searchActive={Boolean(searchTerm.trim())}
                                    departamentos={departamentosFiltrados}
                                    onSeleccionarDepartamento={handleSeleccionarDepartamento}
                                    departamentoSeleccionado={departamentoSeleccionado}
                                />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Details */}
                <div className="col-lg-7 col-md-12">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-3">
                            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                                <div className="departamentos-detail-heading">
                                    <span className="departamentos-eyebrow">DETALLES Y JEFATURA</span>
                                    <h5 className="mt-2 mb-0 fw-semibold">{departamentoSeleccionado?.nombre || 'Información del departamento'}</h5>
                                </div>

                            </div>
                        </div>
                        <div className="card-body bg-light rounded m-3 mt-0 p-4">
                            {departamentoSeleccionado ? (
                                <DetallesJefe
                                    departamento={departamentoSeleccionado}
                                    fetchDepartamentos={fetchDepartamentos}
                                    setDepartamentoSeleccionado={setDepartamentoSeleccionado}
                                />
                            ) : (
                                <div className="departamentos-empty text-center py-5 text-muted">
                                    <i className="bi bi-building fs-1 mb-3 d-block text-secondary opacity-50"></i>{" "}
                                    <h5>Seleccione un departamento</h5>
                                    <p>Explore el árbol de la izquierda y seleccione una unidad para administrar su jefatura y configuración.</p>
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
                fetchDepartamentos={(creado) => fetchDepartamentos({ ...creado, idsAnteriores: flattenTree(departamentos).map(node => node.id) })}
            />
        </div>
    );
}

export default DepartamentosPage;
