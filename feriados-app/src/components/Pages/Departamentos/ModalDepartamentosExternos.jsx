import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { getDepartamentosExterno } from '../../../services/departamentosService';

const ModalDepartamentosExternos = ({ show, onHide, onSelect }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (show) {
            setSearchTerm('');
            fetchDepartamentos();
        }
    }, [show]);

    const fetchDepartamentos = async () => {
        setLoading(true);
        try {
            const result = await getDepartamentosExterno();
            
            let dataArray = [];
            if (Array.isArray(result)) {
                dataArray = result;
            } else if (result && Array.isArray(result.data)) {
                dataArray = result.data;
            }
            
            setDepartamentos(dataArray);
        } catch (error) {
             console.error('Error fetching external departments:', error);
             Swal.fire('Error', 'No se pudieron cargar los departamentos externos.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const departamentosFiltrados = (Array.isArray(departamentos) ? departamentos : []).filter(d => 
        String(d.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        String(d.depto || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!show) {
        return null;
    }

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Seleccionar Departamento Externo</h5>
                            <button type="button" className="btn-close" onClick={onHide}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Buscar por código o nombre..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            
                            {loading ? (
                                <div className="text-center p-4">
                                    <output className="spinner-border text-primary">
                                        <span className="visually-hidden">Cargando...</span>
                                    </output>
                                </div>
                            ) : (
                                <div className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {departamentosFiltrados.length > 0 ? (
                                        departamentosFiltrados.map((d) => (
                                            <button 
                                                key={d.depto}
                                                type="button" 
                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                onClick={() => {
                                                    onSelect(d);
                                                    onHide();
                                                }}
                                            >
                                                <div className="text-start">
                                                    <h6 className="mb-1">{d.nombre}</h6>
                                                    <small className="text-muted">Código: {d.depto}</small>
                                                </div>
                                                <i className="bi bi-chevron-right text-muted"></i>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted p-4">
                                            No se encontraron departamentos que coincidan con la búsqueda.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
    );
};

ModalDepartamentosExternos.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default ModalDepartamentosExternos;
