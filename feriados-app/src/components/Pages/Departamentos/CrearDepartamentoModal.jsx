import PropTypes from 'prop-types';
import ModalBuscarPorNombre from '../../Common/ModalBuscarPorNombre';
import DatosDepartamento from './CrearDepartamentoModal/DatosDepartamento';
import AsignacionJefe from './CrearDepartamentoModal/AsignacionJefe';
import { useCrearDepartamento } from './CrearDepartamentoModal/useCrearDepartamento';

const CrearDepartamentoModal = ({ show, onHide, parent, fetchDepartamentos }) => {
    const formulario = useCrearDepartamento({ show, onHide, parent, fetchDepartamentos });
    const {
        isSaveDisabled, showBuscarNombre, setShowBuscarNombre,
        setRutCompleto, setNombreJefe, handleGuardar
    } = formulario;

    if (!show) {
        return null;
    }

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Crear Nuevo Departamento</h5>
                            <button type="button" className="btn-close" onClick={onHide}></button>
                        </div>
                        <div className="modal-body">
                            <DatosDepartamento parent={parent} {...formulario} />
                            <AsignacionJefe {...formulario} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleGuardar} disabled={isSaveDisabled}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>

            <ModalBuscarPorNombre
                show={showBuscarNombre}
                onClose={() => setShowBuscarNombre(false)}
                onSelected={(func) => {
                    setRutCompleto(`${func.rut}-${func.vrut}`);
                    setNombreJefe(func.nombreCompleto);
                }}
            />
        </>
    );
};

CrearDepartamentoModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    parent: PropTypes.object,
    fetchDepartamentos: PropTypes.func.isRequired,
};

export default CrearDepartamentoModal;
