import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSubroganteForm } from '../../../../hooks/useSubroganteForm';
import { useSubroganteSearch } from '../../../../hooks/useSubroganteSearch';
import ModalBuscarPorNombre from './ModalBuscarPorNombre';
import SubroganteForm from './SubroganteForm';
import SubroganteSearchResult from './SubroganteSearchResult';

const ModalSubrogante = ({ show, onClose, onSubroganteSelected, rutFuncionario, deptoFuncionario, fechaInicio, fechaFin }) => {
    const {
        rut,
        setRut,
        errors,
        setErrors,
        subrogante,
        setSubrogante,
        limpiarCampos,
    } = useSubroganteForm();

    const { handleBuscar } = useSubroganteSearch(setSubrogante, setErrors);
    const [showBuscarPorNombreModal, setShowBuscarPorNombreModal] = useState(false);

    useEffect(() => {
        if (!show) {
            limpiarCampos();
        }
    }, [show, limpiarCampos]);

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
        } else {
            setErrors({ mensaje: 'No hay subrogante seleccionado', detalle: 'Por favor, busque y seleccione un subrogante válido antes de confirmar.' });
        }
    };

    const handleFuncionarioSelectedFromSearch = (selectedFunc) => {
        setRut(selectedFunc.rut);
        setSubrogante(selectedFunc);
        setErrors({ mensaje: '', detalle: '' });
        setShowBuscarPorNombreModal(false);
    };

    return (
        <>
            <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content shadow">
                        <div className="modal-header">
                            <h5 className="modal-title">Asignar Subrogante</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <SubroganteForm
                                rut={rut}
                                setRut={setRut}
                                handleBuscar={handleBuscar}
                                setShowBuscarPorNombreModal={setShowBuscarPorNombreModal}
                            />
                            <SubroganteSearchResult subrogante={subrogante} errors={errors} />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
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