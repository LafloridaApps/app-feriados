import { FaSearch, FaPlus } from 'react-icons/fa';
import ModalBuscarPorNombre from '../../Common/ModalBuscarPorNombre';
import ModalBuscarDepartamento from '../../Common/ModalBuscarDepartamento';
import FiltrosSubrogancia from './IngresoSubrogancia/FiltrosSubrogancia';
import ResultadosSubrogancia from './IngresoSubrogancia/ResultadosSubrogancia';
import FormularioSubrogancia from './IngresoSubrogancia/FormularioSubrogancia';
import { useIngresoSubrogancia } from './IngresoSubrogancia/useIngresoSubrogancia';
import './IngresoSubrogancia.css';

const IngresoSubrogancia = () => {
    const gestion = useIngresoSubrogancia();
    const {
        activeTab,
        setActiveTab,
        editingSubroganciaId,
        jefe,
        subrogante,
        setFechaInicio,
        setFechaFin,
        showBusquedaModal,
        setShowBusquedaModal,
        handleFuncionarioSelected,
        handleSearchByName,
        showDeptoModal,
        setShowDeptoModal,
        handleDepartamentoSelected,
        departamentos
    } = gestion;

    return (
        <div className="container-fluid mt-4 mb-5 fade-in">
            {/* Page Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-start border-4 border-primary">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-1 text-primary fw-bold">Gestión de Subrogancias</h2>
                    <p className="text-muted mb-0">Administre y asigne subrogancias a los funcionarios</p>
                </div>
            </div>

            <div className="subrogancia-main-card">
                <ul className="nav nav-tabs subrogancia-tabs">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'buscar' ? 'active' : ''}`} onClick={() => setActiveTab('buscar')} type="button">
                            <FaSearch className="me-2" /> Buscar Subrogancias
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'crear' ? 'active' : ''}`} onClick={() => { setActiveTab('crear'); if (!editingSubroganciaId) { jefe.reset(); subrogante.reset(); setFechaInicio(''); setFechaFin(''); } }} type="button">
                            <FaPlus className="me-2" /> {editingSubroganciaId ? 'Editar Subrogancia' : 'Nueva Subrogancia'}
                        </button>
                    </li>
                </ul>

                <div className="tab-content tab-content-wrapper">
                    {activeTab === 'buscar' && (
                        <div className="fade-in">
                            <FiltrosSubrogancia {...gestion} />
                            <ResultadosSubrogancia
                                searchResults={gestion.searchResults}
                                handleEditClick={gestion.handleEditClick}
                            />
                        </div>
                    )}

                    {activeTab === 'crear' && (
                        <div className="fade-in">
                            <FormularioSubrogancia {...gestion} />
                        </div>
                    )}
                </div>
            </div>

            <ModalBuscarPorNombre
                show={showBusquedaModal}
                onClose={() => setShowBusquedaModal(false)}
                onSelected={handleFuncionarioSelected}
                onSearch={handleSearchByName}
            />

            <ModalBuscarDepartamento
                show={showDeptoModal}
                onClose={() => setShowDeptoModal(false)}
                onSelected={handleDepartamentoSelected}
                departamentos={departamentos}
            />
        </div>
    );
};

export default IngresoSubrogancia;
