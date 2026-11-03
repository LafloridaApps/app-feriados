const DatosDepartamento = ({ parent, nombre, setNombre }) => (
    <>
        <div className="mb-3">
            <label htmlFor="deptoPadre" className="form-label">Dependiente de:</label>
            <input id="deptoPadre" type="text" className="form-control" readOnly disabled value={parent ? parent.nombre : 'Raíz (Nivel Principal)'} />
        </div>
        <div className="mb-3">
            <label htmlFor="nombreDepto" className="form-label">Nombre del Nuevo Departamento</label>
            <input
                type="text"
                className="form-control"
                id="nombreDepto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder='Ej: Oficina de Partes'
            />
        </div>
    </>
);

export default DatosDepartamento;
