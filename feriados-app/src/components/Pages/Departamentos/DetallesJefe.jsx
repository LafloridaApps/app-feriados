import PropTypes from 'prop-types';
import ModalDepartamentosExternos from './ModalDepartamentosExternos';
import ModalBuscarPorNombre from '../../Common/ModalBuscarPorNombre';
import JefaturaDepartamento from './DetallesJefe/JefaturaDepartamento';
import ConfiguracionDepartamento from './DetallesJefe/ConfiguracionDepartamento';
import { useDetallesJefe } from './DetallesJefe/useDetallesJefe';
import './DetallesJefe.css';

const DetallesJefe = ({ departamento, fetchDepartamentos, setDepartamentoSeleccionado }) => {
    const gestion = useDetallesJefe({ departamento, fetchDepartamentos, setDepartamentoSeleccionado });
    const {
        showModalExterno,
        setShowModalExterno,
        setCodigoExterno,
        showBusquedaModal,
        setShowBusquedaModal,
        setRutCompleto,
        setNombreJefeEditado,
        setDisabled
    } = gestion;

    if (!departamento) {
        return (
            <div className="text-center py-5 text-muted">
                <i className="bi bi-building fs-1 mb-3 d-block text-secondary opacity-50"></i>
                <h5>Seleccione un departamento</h5>
                <p>Haga clic en un departamento del árbol organizativo para ver o editar sus detalles y su respectiva jefatura.</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-4">
            <JefaturaDepartamento departamento={departamento} {...gestion} />
            <ConfiguracionDepartamento departamento={departamento} {...gestion} />

            <ModalDepartamentosExternos
                show={showModalExterno}
                onHide={() => setShowModalExterno(false)}
                onSelect={(d) => setCodigoExterno(d.depto)}
            />

            <ModalBuscarPorNombre
                show={showBusquedaModal}
                onClose={() => setShowBusquedaModal(false)}
                onSelected={(func) => {
                    setRutCompleto(`${func.rut}-${func.vrut}`);
                    setNombreJefeEditado(func.nombreCompleto);
                    setDisabled(false);
                }}
            />
        </div>
    );
}

export default DetallesJefe;

DetallesJefe.propTypes = {
    fetchDepartamentos: PropTypes.func.isRequired,
    departamento: PropTypes.shape({
        id: PropTypes.any.isRequired,
        nombre: PropTypes.string,
        nombreJefe: PropTypes.string,
        rutJefe: PropTypes.any,
        vrutJefe: PropTypes.any,
        email: PropTypes.any,
        codigoExterno: PropTypes.string,
        vigente: PropTypes.bool,
    }),
    setDepartamentoSeleccionado: PropTypes.func
};