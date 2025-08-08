
import { useSubroganteForm } from '../../../../hooks/useSubroganteForm';

const SubroganteForm = ({ fechaInicio, fechaFin, onSubroganteSelect }) => {
    const { rut, setRut, errors, subrogante, buscarSubrogante, limpiarCampos } = useSubroganteForm(fechaInicio, fechaFin, onSubroganteSelect);

    const handleBuscar = (e) => {
        e.preventDefault();
        buscarSubrogante();
    };


    return (
        <div>
            <form onSubmit={handleBuscar}>
                <div className="row">
                    <div className="col-md-8">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="RUT del subrogante"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary">Buscar</button>
                    </div>
                </div>
            </form>
            {errors.mensaje && <div className="alert alert-danger mt-2">{errors.mensaje}</div>}
            {subrogante && (
                <div className="mt-3">
                    <h5>Subrogante Encontrado</h5>
                    <p> <strong>Nombre :</strong> {subrogante.nombre}</p>
                    <p> <strong>Apellidos : </strong> {subrogante.apellidoPaterno} {subrogante.apellidoMaterno} </p>
                    <p> <strong>Departamento : </strong> {subrogante.departamento}</p>
                    <button className="btn btn-danger" onClick={limpiarCampos}>Quitar</button>
                </div>
            )}
        </div>
    );
};

export default SubroganteForm;