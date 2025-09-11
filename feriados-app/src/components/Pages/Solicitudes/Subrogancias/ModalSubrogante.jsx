import {  useState } from 'react';
import PropTypes from 'prop-types';
import ModalBuscarPorNombre from './ModalBuscarPorNombre';
import SubroganteForm from './SubroganteForm';

const ModalSubrogante = ({ show, onClose, onSubroganteSelected, rutFuncionario, deptoFuncionario, fechaInicio, fechaFin }) => {
    const [subrogante, setSubrogante] = useState(null);
    const [showBuscarPorNombreModal, setShowBuscarPorNombreModal] = useState(false);

    const handleConfirmar = () => {
        if (subrogante?.rut && subrogante?.nombre) {
            const subrogancia = {
                rutSubrogante: subrogante.rut,
                rutJefe: rutFuncionario,
                nombreSubrogante: subrogante.nombre,
                departamentoSubrogante: subrogante.departamento,
                vrutSubrogante: subrogante.vrut,
            };
            onSubroganteSelected(subrogancia);
            onClose();
        }
    };

    const handleFuncionarioSelectedFromSearch = (selectedFunc) => {
        setSubrogante(selectedFunc);
        setShowBuscarPorNombreModal(false);
    };

    return (
        <>
            <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content shadow">
                        <div className="modal-header">
                            <h5 className="modal-title">Asignar Subrogante</h5>
                            <button type="button" className="btn-close" onClick={() => { setSubrogante(null); onClose(); }}></button>
                        </div>
                        <div className="modal-body">
                            <SubroganteForm
                                fechaInicio={fechaInicio}
                                fechaFin={fechaFin}
                                onSubroganteSelect={setSubrogante}
                                subrogante={subrogante}
                            />
                            <button className="btn btn-link" onClick={() => setShowBuscarPorNombreModal(true)}>Buscar por nombre</button>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => { setSubrogante(null); onClose(); }}>Cancelar</button>
                            <button className="btn btn-success" onClick={handleConfirmar} disabled={!subrogante}>
                                Confirmar Subrogante
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalBuscarPorNombre
                show={showBuscarPorNombreModal}
                onClose={() => setShowBuscarPorNombreModal(false)}
                onFuncionarioSelected={handleFuncionarioSelectedFromSearch}
                deptoFuncionario={deptoFuncionario}
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
            />
        </>
    );
};

ModalSubrogante.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubroganteSelected: PropTypes.func.isRequired,
    rutFuncionario: PropTypes.number.isRequired,
    deptoFuncionario: PropTypes.string.isRequired,
    fechaInicio: PropTypes.string.isRequired,
    fechaFin: PropTypes.string.isRequired,
};

export default ModalSubrogante;