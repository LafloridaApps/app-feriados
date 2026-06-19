import React, { useState, useEffect } from 'react';
import { useUsuario } from '../../../hooks/useUsuario';
import axios from 'axios';

const InformesTab = () => {
    const funcionario = useUsuario();
    const codDeptoUsuario = funcionario?.codDepto || '';

    const [filtroDepto, setFiltroDepto] = useState('todos');
    const [filtroAnio, setFiltroAnio] = useState(new Date().getFullYear().toString());
    const [informesData, setInformesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInformes = async () => {
            if (!codDeptoUsuario) return;
            setLoading(true);
            setError(null);
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'https://appd2.laflorida.cl';
                
                const response = await axios.get(`${API_URL}/solicitudes/dashboard/resumen-permisos`, {
                    params: {
                        codDeptoUsuario,
                        anio: filtroAnio,
                        codDeptoFiltro: filtroDepto
                    }
                });
                setInformesData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Error al obtener los datos del informe');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInformes();
    }, [codDeptoUsuario, filtroAnio, filtroDepto]);

    if (loading) {
        return <div className="text-center py-5 text-muted"><output className="spinner-border spinner-border-sm me-2"></output>Cargando informes...</div>;
    }

    if (error) {
        return <div className="alert alert-danger m-3">{error}</div>;
    }

    const maxPorMes = Math.max(...informesData.porMes.map(m => m.cantidad), 1);
    const maxPorDepto = Math.max(...informesData.porDepartamento.map(d => d.cantidad), 1);

    return (
        <div className="py-3">
            {/* Filtros */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-light p-3 rounded border">
                <h5 className="mb-3 mb-md-0 text-secondary fw-bold">
                    Resumen de Permisos
                </h5>
                <div className="d-flex gap-2">
                    <select 
                        className="form-select form-select-sm" 
                        value={filtroDepto} 
                        onChange={(e) => setFiltroDepto(e.target.value)}
                    >
                        {informesData.departamentosDropdown.map(d => (
                            <option key={d.id} value={d.id}>{d.nombre}</option>
                        ))}
                    </select>
                    <select 
                        className="form-select form-select-sm" 
                        value={filtroAnio} 
                        onChange={(e) => setFiltroAnio(e.target.value)}
                        style={{ width: '100px' }}
                    >
                        {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tarjetas KPI */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm border-start border-4 border-primary h-100">
                        <div className="card-body">
                            <p className="text-muted small mb-1">Total Solicitudes</p>
                            <h3 className="fw-bold mb-0 text-dark">{informesData.kpis.totalAnual}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm border-start border-4 border-success h-100">
                        <div className="card-body">
                            <p className="text-muted small mb-1">Aprobadas</p>
                            <h3 className="fw-bold mb-0 text-success">{informesData.kpis.aprobadas}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm border-start border-4 border-warning h-100">
                        <div className="card-body">
                            <p className="text-muted small mb-1">Pendientes</p>
                            <h3 className="fw-bold mb-0 text-warning">{informesData.kpis.pendientes}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm border-start border-4 border-danger h-100">
                        <div className="card-body">
                            <p className="text-muted small mb-1">Postergadas</p>
                            <h3 className="fw-bold mb-0 text-danger">{informesData.kpis.postergadas}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Gráfico Mock Vertical: Solicitudes por Mes */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                            <h6 className="fw-bold text-secondary">Volumen de Solicitudes (Mensual)</h6>
                        </div>
                        <div className="card-body d-flex align-items-end mt-4" style={{ minHeight: '220px', gap: '4px' }}>
                            {informesData.porMes.map((m, idx) => (
                                <div key={`${m.mes}-${idx}`} className="d-flex flex-column align-items-center flex-fill h-100 justify-content-end group-hover">
                                    <span className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>{m.cantidad}</span>
                                    <div 
                                        className="bg-primary rounded-top opacity-75 w-100" 
                                        style={{ height: `${(m.cantidad / maxPorMes) * 100}%`, maxWidth: '40px', transition: 'height 0.5s ease' }}
                                        title={`${m.cantidad} solicitudes en ${m.mes}`}
                                    ></div>
                                    <span className="small text-secondary mt-2 fw-medium">{m.mes}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gráfico Mock Horizontal: Por Departamento */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                            <h6 className="fw-bold text-secondary">Top Departamentos</h6>
                        </div>
                        <div className="card-body">
                            {informesData.porDepartamento.map(d => (
                                <div key={d.nombreDepto} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center small mb-1">
                                        <span className="text-truncate me-2" style={{ maxWidth: '200px' }} title={d.nombreDepto}>{d.nombreDepto}</span>
                                        <span className="fw-bold text-dark">{d.cantidad}</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <progress 
                                            className={`progress-bar ${d.color}`} 
                                            style={{ width: `${(d.cantidad / maxPorDepto) * 100}%` }}
                                            value={d.cantidad}
                                            max={maxPorDepto}
                                        ></progress>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InformesTab;