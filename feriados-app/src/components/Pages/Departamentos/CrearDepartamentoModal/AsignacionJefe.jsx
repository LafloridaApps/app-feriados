import { FaSearch } from 'react-icons/fa';

const AsignacionJefe = ({ rutCompleto, setRutCompleto, nombreJefe, setShowBuscarNombre, handlerOnBlurRut }) => (
    <>
        <hr />
        <h6 className="text-muted">Asignar Jefe (Opcional)</h6>
        <div className="mb-3">
            <label htmlFor="rutJefe" className="form-label">RUT del Jefe</label>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    id="rutJefe"
                    value={rutCompleto}
                    onChange={(e) => setRutCompleto(e.target.value)}
                    placeholder='Ej: 12345678-9'
                />
                <button 
                    className="btn btn-outline-secondary" 
                    type="button" 
                    onClick={() => setShowBuscarNombre(true)}
                    title="Buscar por nombre"
                >
                    <FaSearch className="me-1" />{' '}Buscar Nombre
                </button>
                <button 
                    className="btn btn-outline-primary" 
                    type="button" 
                    onClick={handlerOnBlurRut}
                >
                    Buscar RUT
                </button>
            </div>
        </div>
        <div className="mb-3">
            <label htmlFor="nombreJefeDisplay" className="form-label">Nombre del Jefe</label>
            <input id="nombreJefeDisplay" type="text" className="form-control" readOnly disabled value={nombreJefe} />
        </div>
    </>
);

export default AsignacionJefe;
