import PropTypes from 'prop-types';
import BuscadorFuncionarios from './ModalBuscarPorNombre/BuscadorFuncionarios';
import ResultadosFuncionarios from './ModalBuscarPorNombre/ResultadosFuncionarios';
import { useBuscarPorNombre } from './ModalBuscarPorNombre/useBuscarPorNombre';

const ModalBuscarPorNombre = ({ show, onClose, onSelected, buscarFuncionarios }) => {
    const busqueda = useBuscarPorNombre({ show, onClose, onSelected, buscarFuncionarios });
    const { selectedFuncionario, handleConfirm } = busqueda;

    return (
        <div
            className={`modal fade ${show ? 'show d-block' : ''}`}
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content shadow">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-person-search me-2"></i>Buscar Funcionario
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">

                        <BuscadorFuncionarios {...busqueda} />
                        <ResultadosFuncionarios {...busqueda} />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleConfirm}
                            disabled={!selectedFuncionario}
                        >
                            <i className="bi bi-check-circle me-2"></i>Confirmar Selección
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ModalBuscarPorNombre.propTypes = {
    buscarFuncionarios: PropTypes.func,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelected: PropTypes.func.isRequired,
};

export default ModalBuscarPorNombre;