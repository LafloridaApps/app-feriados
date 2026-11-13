import {  useState } from 'react';
import PropTypes from 'prop-types';
import ModalBuscarPorNombre from '../../../Common/ModalBuscarPorNombre';
import SubroganteForm from './SubroganteForm';
import { subroganciaService } from '../../../../services/subroganciaService';

const ModalSubrogante = ({ show, onClose, onSubroganteSelected, rutFuncionario, fechaInicio, fechaFin }) => {
    const [subrogante, setSubrogante] = useState(null);
    const [cargandoFicha, setCargandoFicha] = useState(false);
    const [errorFicha, setErrorFicha] = useState('');
    const [showBuscarPorNombreModal, setShowBuscarPorNombreModal] = useState(false);

    const handleConfirmar = () => {
        if (subrogante?.rut && subrogante?.nombre) {
            const subrogancia = {
                rutSubrogante: subrogante.rut,
                rutJefe: rutFuncionario,
                nombreSubrogante: [subrogante.nombre, subrogante.apellidoPaterno, subrogante.apellidoMaterno].filter(Boolean).join(' '),
                departamentoSubrogante: subrogante.departamento,
                vrutSubrogante: subrogante.vrut,
            };
            onSubroganteSelected(subrogancia);
            onClose();
        }
    };

    const handleFuncionarioSelectedFromSearch = async (selectedFunc) => {
        setShowBuscarPorNombreModal(false);
        setSubrogante(null);
        setErrorFicha('');
        if (!fechaInicio || !fechaFin) {
            setErrorFicha('Seleccione las fechas de la solicitud antes de asignar un subrogante.');
            return;
        }
        setCargandoFicha(true);
        try {
            const ficha = await subroganciaService.buscarPorRut(selectedFunc.rut, fechaInicio, fechaFin);
            if (!ficha?.rut || !ficha.nombre) {
                throw new Error('No se pudo obtener la ficha del funcionario seleccionado.');
            }
            setSubrogante(ficha);
        } catch (error) {
            setErrorFicha(error.response?.data?.mensaje || error.response?.data?.message
                || error.message || 'No se pudo cargar el funcionario seleccionado.');
        } finally {
            setCargandoFicha(false);
        }
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
                            {cargandoFicha && <output className="d-block mb-3">Cargando datos del subrogante…</output>}
                            {errorFicha && <div className="alert alert-danger" role="alert">{errorFicha}</div>}
                            <SubroganteForm
                                fechaInicio={fechaInicio}
                                fechaFin={fechaFin}
                                onSubroganteSelect={setSubrogante}
                                subrogante={subrogante}
                            />
                            <button className="btn btn-link" disabled={cargandoFicha} onClick={() => { setErrorFicha(''); setShowBuscarPorNombreModal(true); }}>Buscar por nombre</button>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => { setSubrogante(null); onClose(); }}>Cancelar</button>
                            <button className="btn btn-success" onClick={handleConfirmar} disabled={cargandoFicha || !subrogante?.rut || !subrogante?.nombre}>
                                Confirmar Subrogante
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalBuscarPorNombre
                show={showBuscarPorNombreModal}
                onClose={() => setShowBuscarPorNombreModal(false)}
                onSelected={handleFuncionarioSelectedFromSearch}
            />
        </>
    );
};

ModalSubrogante.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubroganteSelected: PropTypes.func.isRequired,
    rutFuncionario: PropTypes.number.isRequired,
    fechaInicio: PropTypes.string.isRequired,
    fechaFin: PropTypes.string.isRequired,
};

export default ModalSubrogante;