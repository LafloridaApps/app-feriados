import ArbolDepartamentos from './ArbolDepartamentos';
import DetallesJefe from './DetallesJefe';
import CrearDepartamentoModal from './CrearDepartamentoModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ArbolDepartamentos.css';
import useDepartamentos from '../../../hooks/useDepartamentos';
import useJefeDepartamento from '../../../hooks/useJefeDepartamento';
import useCrearDepartamentoModal from '../../../hooks/useCrearDepartamentoModal';
import useSeleccionarDepartamento from '../../../hooks/useSeleccionarDepartamento';

const DepartamentosPage = () => {
    const {
        departamentosFiltrados,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        fetchDepartamentos
    } = useDepartamentos();

    const {
        departamentoSeleccionado,
        handleSeleccionarDepartamento
    } = useSeleccionarDepartamento();

    const { jefeSeleccionado, isJefeLoading } = useJefeDepartamento(departamentoSeleccionado);

    const {
        showCrearModal,
        parentDepartment,
        handleShowCrearModal,
        handleHideCrearModal
    } = useCrearDepartamentoModal();

    if (error) {
        return <div className="container mt-5 alert alert-danger"><p>Error al cargar: {error}</p></div>;
    }


    console.log(departamentosFiltrados)
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
