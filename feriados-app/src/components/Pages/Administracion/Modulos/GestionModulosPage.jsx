
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { listarModulos } from '../../../../services/moduloService';



const GestionModulosPage = () => {
    const [modulos, setModulos] = useState([]);
    const [nombreModulo, setNombreModulo] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(()=>{

        const getModulos = async () => {

            const data = await listarModulos();
            setModulos(data);
        }
        getModulos()

    },[])

    const handleAddModule = async (e) => {
        e.preventDefault();
        if (!nombreModulo) {
            Swal.fire('Por favor, ingrese el nombre del módulo', '', 'warning');
            return;
        }
        setLoading(true);

   

        const newModule = {
           
            nombre: nombreModulo,
        };

        // await createModulo(newModule); // Removed this line

        setModulos([...modulos, newModule]);
        setNombreModulo(''); // Limpiar el input
        setLoading(false);
        Swal.fire('Módulo Agregado', `El módulo "${nombreModulo}" ha sido agregado.`, 'success');
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Gestión de Módulos</h2>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-header">
                            Agregar Nuevo Módulo
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAddModule}>
                                <div className="row">
                                    <div className="col-md-9">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombreModulo"
                                            placeholder="Nombre del nuevo módulo"
                                            value={nombreModulo}
                                            onChange={(e) => setNombreModulo(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ...
                                                </>
                                            ) : 'Agregar'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            Módulos Existentes
                        </div>
                        <div className="card-body">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nombre del Módulo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modulos.map(modulo => (
                                        <tr key={modulo.id}>
                                            <th scope="row">{modulo.id}</th>
                                            <td>{modulo.nombre}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionModulosPage;
