import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { useFuncionarioSearch } from '../../../hooks/useFuncionarioSearch';
import { saveSubrogancia, subroganciaService, updateSubrogancia, deleteSubrogancia } from '../../../services/subroganciaService';
import './IngresoSubrogancia.css';
import { FaSearch, FaUserTie, FaUserPlus, FaCalendarAlt, FaBuilding, FaPlus, FaEdit } from 'react-icons/fa';
import ModalBuscarPorNombre from '../../Common/ModalBuscarPorNombre';
import ModalBuscarDepartamento from '../../Common/ModalBuscarDepartamento';
import { DepartamentoContext } from '../../../context/DepartamentoContext';

const IngresoSubrogancia = () => {
    // Tab State
    const [activeTab, setActiveTab] = useState('buscar'); // 'buscar' or 'crear'

    // Form Search State
    const [filtroRutJefe, setFiltroRutJefe] = useState('');
    const [filtroRutSubrogante, setFiltroRutSubrogante] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [filtroIdDepto, setFiltroIdDepto] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [showDeptoModal, setShowDeptoModal] = useState(false);

    const { departamentos } = useContext(DepartamentoContext);

    const handleLimpiarFiltros = () => {
        setFiltroRutJefe('');
        setFiltroRutSubrogante('');
        setFiltroDepartamento('');
        setFiltroIdDepto('');
        setSearchResults([]);
    };

    // Form Create State
    const jefe = useFuncionarioSearch();
    const subrogante = useFuncionarioSearch();
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingSubroganciaId, setEditingSubroganciaId] = useState(null);
    const [editingSubroganciaData, setEditingSubroganciaData] = useState(null);
    const [showBusquedaModal, setShowBusquedaModal] = useState(false);
    const [modalTarget, setModalTarget] = useState(null);

    // Handlers Search
    const handleSearch = async (e) => {
        e.preventDefault();

        const filledFilters = [filtroRutJefe, filtroRutSubrogante, filtroDepartamento].filter(Boolean);
        if (filledFilters.length === 0) {
            Swal.fire({ icon: 'warning', title: 'Filtro requerido', text: 'Ingrese al menos un criterio de búsqueda.' });
            return;
        }
        if (filledFilters.length > 1) {
            Swal.fire({ icon: 'warning', title: 'Un solo filtro', text: 'Ingrese solo un criterio a la vez: RUT Jefe, RUT Subrogante o Departamento.' });
            return;
        }

        const soloRut = (rutCompleto) => rutCompleto.split('-')[0].trim();

        setIsSearching(true);
        try {
            const params = {};
            if (filtroRutJefe) params.rutJefe = soloRut(filtroRutJefe);
            if (filtroRutSubrogante) params.subrogante = soloRut(filtroRutSubrogante);
            
            // Priorizar el ID del departamento seleccionado
            if (filtroIdDepto) {
                params.idDepto = filtroIdDepto;
            } else if (filtroDepartamento) {
                // Si escribió algo pero no seleccionó del autocompletado, 
                // intentar buscar coincidencia exacta por nombre antes de fallar
                const match = departamentos.find(d => d.nombreDepartamento.toLowerCase() === filtroDepartamento.toLowerCase());
                if (match) {
                    params.idDepto = match.idDepto;
                } else {
                    Swal.fire({ icon: 'warning', title: 'Departamento no válido', text: 'Seleccione un departamento de la lista de sugerencias.' });
                    setIsSearching(false);
                    return;
                }
            }

            const resultados = await subroganciaService.buscarSubroganciasExistentes(params);
            const lista = Array.isArray(resultados) ? resultados : [];
            setSearchResults(lista);

            if (lista.length === 0) {
                Swal.fire({ icon: 'info', title: 'Sin resultados', text: 'No se encontraron subrogancias con los filtros indicados.' });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo realizar la búsqueda. Verifique la conexión con el servidor.' });
        } finally {
            setIsSearching(false);
        }
    };

    const handleEditClick = (sub) => {
        // Usar idSubrogancia como identificador
        setEditingSubroganciaId(sub.idSubrogancia);
        setEditingSubroganciaData({
            idSubrogancia:  sub.idSubrogancia,
            nombreJefe:     sub.nombreJefe,
            subrogante:     sub.subrogante,
            departamento:   sub.departamento,
            fechaInicio:    sub.fechaInicio,
            fechaFin:       sub.fechaFin,
            rutJefe:        sub.rutJefe,
            vrutJefe:       sub.vrutJefe,
            rutSubrogante:  sub.rutSubrogante,
            vrutSubrogante: sub.vrutSubrogante,
        });
        setFechaInicio(sub.fechaInicio);
        setFechaFin(sub.fechaFin);
        setActiveTab('crear');
    };

    const handleDelete = async (sub) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar subrogancia?',
            html: `<b>${sub.nombreJefe}</b> → ${sub.subrogante}<br/><small>${sub.fechaInicio} al ${sub.fechaFin}</small>`,
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            confirmButtonColor: '#dc3545',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;
        try {
            // Usar idSubrogancia como identificador
            await deleteSubrogancia(sub.idSubrogancia);
            Swal.fire({ icon: 'success', title: 'Eliminada', text: 'La subrogancia fue eliminada correctamente.' });
            setSearchResults(prev => prev.filter(r => r.idSubrogancia !== sub.idSubrogancia));
            if (editingSubroganciaId) cancelEdit();
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar la subrogancia.' });
        }
    };

    const cancelEdit = () => {
        setEditingSubroganciaId(null);
        setEditingSubroganciaData(null);
        jefe.reset();
        subrogante.reset();
        setFechaInicio('');
        setFechaFin('');
        setActiveTab('buscar');
    };

    // Handlers Create
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // En edici\u00f3n los datos vienen de editingSubroganciaData, no de los hooks de b\u00fasqueda
        if (!editingSubroganciaId && (!jefe.nombre || !subrogante.nombre)) {
            Swal.fire({ icon: 'warning', title: 'Datos Incompletos', text: 'Debe buscar tanto al jefe como al subrogante.' });
            setIsSaving(false); return;
        }
        if (!fechaInicio || !fechaFin) {
            Swal.fire({ icon: 'warning', title: 'Fechas Incompletas', text: 'Seleccione las fechas.' });
            setIsSaving(false); return;
        }
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            Swal.fire({ icon: 'error', title: 'Fechas Inválidas', text: 'La fecha de inicio no puede ser posterior a la fecha de fin.' });
            setIsSaving(false); return;
        }

        // En modo edición: enviar rutJefe, rutSubrogante y las nuevas fechas
        const subroganciaData = editingSubroganciaId
            ? {
                rutJefe:       editingSubroganciaData.rutJefe,
                rutSubrogante: editingSubroganciaData.rutSubrogante,
                fechaInicio,
                fechaFin,
            }
            : {
                rutJefe: jefe.rutSinDV,
                rutSubrogante: subrogante.rutSinDV,
                fechaInicio,
                fechaFin,
                idDepto: jefe.idDepto
            };

        try {
            let response;
            if (editingSubroganciaId) {
                response = await updateSubrogancia(editingSubroganciaId, subroganciaData);
            } else {
                response = await saveSubrogancia(subroganciaData);
            }
            if (response && response.status >= 200 && response.status < 300) {
                Swal.fire({ icon: 'success', title: editingSubroganciaId ? 'Cambios Guardados' : 'Subrogancia Guardada', text: 'Registrada correctamente.' });
                jefe.reset(); subrogante.reset(); setFechaInicio(''); setFechaFin('');
                setEditingSubroganciaId(null);
                setEditingSubroganciaData(null);
                setActiveTab('buscar');
            } else {
                throw new Error(response?.data?.message || 'Error en validación.');
            }
        } catch (error) {
            console.error(error);
            const apiMessage = error.response?.data?.message;
            Swal.fire({ icon: 'error', title: 'Error al Guardar', text: apiMessage || error.message || 'No se pudo guardar la subrogancia.' });
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusBadge = (estado) => {
        if (!estado) return null;
        const map = {
            'ACTIVA': { cls: 'badge-active', label: 'Activa' },
            'PROGRAMADA': { cls: 'badge-future', label: 'Programada' },
            'FINALIZADA': { cls: 'badge-past', label: 'Finalizada' },
        };
        const entry = map[estado.toUpperCase()] ?? { cls: 'badge-past', label: estado };
        return <span className={`badge-status ${entry.cls}`}>{entry.label}</span>;
    };

    const getSubmitButtonText = () => {
        if (isSaving) return 'Guardando...';
        if (editingSubroganciaId) return 'Guardar Cambios';
        return 'Guardar Subrogancia';
    };

    const handleOpenBusquedaModal = (target) => {
        setModalTarget(target);
        setShowBusquedaModal(true);
    };

    const handleSearchByName = async (nombre) => {
        return await subroganciaService.buscarPorNombre(nombre, null, null, 0, null);
    };

    const handleFuncionarioSelected = async (funcionario) => {
        const fullRut = `${funcionario.rut}-${funcionario.vrut}`;

        if (modalTarget === 'filtroJefe') {
            setFiltroRutJefe(fullRut);
        } else if (modalTarget === 'filtroSub') {
            setFiltroRutSubrogante(fullRut);
        } else if (modalTarget === 'createJefe') {
            jefe.initData(fullRut, funcionario.rut, `${funcionario.nombre} ${funcionario.apellidoPaterno} ${funcionario.apellidoMaterno}`, funcionario.departamento);
        } else if (modalTarget === 'createSub') {
            subrogante.initData(fullRut, funcionario.rut, `${funcionario.nombre} ${funcionario.apellidoPaterno} ${funcionario.apellidoMaterno}`, funcionario.departamento);
        }
    };

    const handleDepartamentoSelected = (depto) => {
        setFiltroDepartamento(depto.nombreDepartamento);
        setFiltroIdDepto(depto.idDepto);
    };

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
                            <h5 className="section-title"><FaSearch /> Filtros de Búsqueda</h5>
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="row g-3">
                                    <div className="col-md-4 form-group-custom">
                                        <label htmlFor="filtroRutJefe">RUT Jefe</label>
                                        <div className="input-group">
                                            <input id="filtroRutJefe" type="text" className="form-control input-custom" placeholder="Ej: 12345678-9" value={filtroRutJefe} onChange={(e) => setFiltroRutJefe(e.target.value)} />
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleOpenBusquedaModal('filtroJefe')} title="Buscar por nombre">
                                                <FaSearch />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-4 form-group-custom">
                                        <label htmlFor="filtroRutSubrogante">RUT Subrogante</label>
                                        <div className="input-group">
                                            <input id="filtroRutSubrogante" type="text" className="form-control input-custom" placeholder="Ej: 98765432-1" value={filtroRutSubrogante} onChange={(e) => setFiltroRutSubrogante(e.target.value)} />
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleOpenBusquedaModal('filtroSub')} title="Buscar por nombre">
                                                <FaSearch />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-4 form-group-custom">
                                        <label htmlFor="filtroDepartamento">Departamento</label>
                                        <div className="input-group autocomplete-container">
                                            <input
                                                id="filtroDepartamento"
                                                type="text"
                                                className="form-control input-custom"
                                                placeholder="Nombre de depto"
                                                value={filtroDepartamento}
                                                onChange={(e) => {
                                                    setFiltroDepartamento(e.target.value);
                                                    setFiltroIdDepto(''); // Reset ID if user types manually
                                                    setMostrarSugerencias(true);
                                                }}
                                                onFocus={() => setMostrarSugerencias(true)}
                                                onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                                                autoComplete="off"
                                            />
                                            <button 
                                                className="btn btn-outline-secondary" 
                                                type="button" 
                                                onClick={() => setShowDeptoModal(true)} 
                                                title="Buscar en tabla de departamentos"
                                                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                            >
                                                <FaSearch />
                                            </button>
                                            {mostrarSugerencias && filtroDepartamento.length > 1 && (
                                                <div className="autocomplete-suggestions">
                                                    {departamentos
                                                        .filter(d => 
                                                            d?.nombreDepartamento?.toLowerCase().includes(filtroDepartamento.toLowerCase())
                                                        )
                                                        .slice(0, 10)
                                                        .map(depto => (
                                                            <button 
                                                                key={depto.idDepto} 
                                                                className="suggestion-item w-100 text-start border-0 bg-transparent"
                                                                type="button"
                                                                onClick={() => {
                                                                    setFiltroDepartamento(depto.nombreDepartamento);
                                                                    setFiltroIdDepto(depto.idDepto);
                                                                    setMostrarSugerencias(false);
                                                                }}
                                                            >
                                                                {depto.nombreDepartamento}
                                                            </button>
                                                        ))
                                                    }
                                                    {departamentos.filter(d => 
                                                        d?.nombreDepartamento?.toLowerCase().includes(filtroDepartamento.toLowerCase())
                                                    ).length === 0 && (
                                                        <div className="suggestion-item text-muted">No se encontraron departamentos</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 d-flex justify-content-end gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={handleLimpiarFiltros}
                                            disabled={isSearching}
                                        >
                                            Limpiar filtros
                                        </button>
                                        <button type="submit" className="btn btn-custom-primary" disabled={isSearching}>
                                            {isSearching ? 'Buscando...' : 'Buscar'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <h5 className="section-title mt-5"><FaBuilding /> Resultados</h5>
                            <div className="table-responsive">
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            <th>Estado</th>
                                            <th>Jefe</th>
                                            <th>Subrogante</th>
                                            <th>Departamento</th>
                                            <th>Inicio</th>
                                            <th>Fin</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchResults.length > 0 ? (
                                            searchResults.map((res, idx) => (
                                                <tr key={`${res.nombreJefe}-${res.fechaInicio}-${idx}`}>
                                                    <td>{getStatusBadge(res.estado)}</td>
                                                    <td>{res.nombreJefe}</td>
                                                    <td>{res.subrogante}</td>
                                                    <td>{res.departamento}</td>
                                                    <td>{res.fechaInicio}</td>
                                                    <td>{res.fechaFin}</td>
                                                    <td>
                                                        {res.estado?.toUpperCase() !== 'FINALIZADA' && (
                                                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(res)} title="Editar">
                                                                <FaEdit />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4 text-muted">Realiza una búsqueda para ver resultados.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'crear' && (
                        <div className="fade-in">
                            <form onSubmit={handleSubmit}>
                                {/* En modo edición: mostrar info de solo lectura */}
                                {editingSubroganciaId && editingSubroganciaData ? (
                                    <div className="row g-4 mb-3">
                                        <div className="col-md-6 border-end form-group-custom">
                                            <h5 className="section-title"><FaUserTie /> Datos del Jefe</h5>
                                            <div className="mb-2">
                                                <span className="custom-label-text">Nombre</span>
                                                <div className="readonly-field">{editingSubroganciaData.nombreJefe}</div>
                                            </div>
                                            <div className="mb-2">
                                                <span className="custom-label-text">Departamento</span>
                                                <div className="readonly-field">{editingSubroganciaData.departamento}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 form-group-custom">
                                            <h5 className="section-title"><FaUserPlus /> Datos del Subrogante</h5>
                                            <div className="mb-2">
                                                <span className="custom-label-text">Nombre</span>
                                                <div className="readonly-field">{editingSubroganciaData.subrogante}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row g-4">
                                        <div className="col-md-6 border-end form-group-custom">
                                            <h5 className="section-title"><FaUserTie /> Datos del Jefe</h5>
                                            <div className="mb-3">
                                                <label htmlFor="rutJefeInput">RUT del Jefe</label>
                                                <div className="input-group input-group-custom">
                                                    <input id="rutJefeInput" type="text" className="form-control input-custom" value={jefe.rut} onChange={jefe.handleRutChange} placeholder="Sin puntos y con guión" />
                                                    <button className="btn btn-outline-primary btn-search" type="button" onClick={jefe.handleBuscar}>Buscar RUT</button>
                                                    <button className="btn btn-outline-secondary" type="button" onClick={() => handleOpenBusquedaModal('createJefe')} title="Buscar por nombre">
                                                        <FaSearch className="me-1" /> Buscar Nombre
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <span className="custom-label-text">Nombre</span>
                                                <div className="readonly-field">{jefe.nombre || 'Esperando búsqueda...'}</div>
                                            </div>
                                            <div className="mb-3">
                                                <span className="custom-label-text">Departamento</span>
                                                <div className="readonly-field">{jefe.departamento || 'Esperando búsqueda...'}</div>
                                            </div>
                                        </div>

                                        <div className="col-md-6 form-group-custom">
                                            <h5 className="section-title"><FaUserPlus /> Datos del Subrogante</h5>
                                            <div className="mb-3">
                                                <label htmlFor="rutSubroganteInput">RUT del Subrogante</label>
                                                <div className="input-group input-group-custom">
                                                    <input id="rutSubroganteInput" type="text" className="form-control input-custom" value={subrogante.rut} onChange={subrogante.handleRutChange} placeholder="Sin puntos y con guión" />
                                                    <button className="btn btn-outline-primary btn-search" type="button" onClick={subrogante.handleBuscar}>Buscar RUT</button>
                                                    <button className="btn btn-outline-secondary" type="button" onClick={() => handleOpenBusquedaModal('createSub')} title="Buscar por nombre">
                                                        <FaSearch className="me-1" /> Buscar Nombre
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <span className="custom-label-text">Nombre</span>
                                                <div className="readonly-field">{subrogante.nombre || 'Esperando búsqueda...'}</div>
                                            </div>
                                            <div className="mb-3">
                                                <span className="custom-label-text">Departamento</span>
                                                <div className="readonly-field">{subrogante.departamento || 'Esperando búsqueda...'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <hr className="my-4" />

                                <div className="row form-group-custom">
                                    <div className="col-12">
                                        <h5 className="section-title"><FaCalendarAlt /> Período de Subrogancia</h5>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="fechaInicioInput">Fecha de Inicio</label>
                                        <input id="fechaInicioInput" type="date" className="form-control input-custom" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="fechaFinInput">Fecha de Fin</label>
                                        <input id="fechaFinInput" type="date" className="form-control input-custom" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center gap-2 mt-4">
                                    <div>
                                        {editingSubroganciaId && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => handleDelete(editingSubroganciaData && { ...editingSubroganciaData, id: editingSubroganciaId })}
                                            >
                                                <i className="bi bi-trash me-1"></i>Eliminar Subrogancia
                                            </button>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2">
                                        {editingSubroganciaId && (
                                            <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>
                                                Cancelar Edición
                                            </button>
                                        )}
                                        <button type="submit" className="btn btn-custom-primary text-white" disabled={isSaving}>
                                            {getSubmitButtonText()}
                                        </button>
                                    </div>
                                </div>
                            </form>
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
