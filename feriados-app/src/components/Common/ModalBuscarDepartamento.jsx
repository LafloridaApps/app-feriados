import PropTypes from 'prop-types';
import BuscadorDepartamentos from './ModalBuscarDepartamento/BuscadorDepartamentos';
import ResultadosDepartamentos from './ModalBuscarDepartamento/ResultadosDepartamentos';
import { useBuscarDepartamento } from './ModalBuscarDepartamento/useBuscarDepartamento';

const ModalBuscarDepartamento = ({ show, onClose, onSelected, departamentos }) => {
    const {
        searchTerm, setSearchTerm, selectedDepto, setSelectedDepto,
        filteredDepartamentos, handleConfirm,
    } = useBuscarDepartamento({ show, onClose, onSelected, departamentos });

    return (
        <div
            className={`modal fade ${show ? 'show d-block' : ''}`}
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content shadow">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title">
                            <i className="bi bi-building-search me-2"></i>Buscar Departamento
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <BuscadorDepartamentos searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <ResultadosDepartamentos searchTerm={searchTerm} filteredDepartamentos={filteredDepartamentos}
                            selectedDepto={selectedDepto} setSelectedDepto={setSelectedDepto} />
                    </div>

                    <div className="modal-footer bg-light">
                        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button
                            className="btn btn-primary px-4"
                            onClick={handleConfirm}
                            disabled={!selectedDepto}
                        >
                            <i className="bi bi-check-circle me-2"></i>Confirmar Selección
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ModalBuscarDepartamento.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelected: PropTypes.func.isRequired,
    departamentos: PropTypes.array.isRequired
};

export default ModalBuscarDepartamento;
