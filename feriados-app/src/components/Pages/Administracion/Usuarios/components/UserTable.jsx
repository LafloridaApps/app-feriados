import React from 'react';

const UserTable = ({ usuarios, onManageClick }) => (
    <div className="card">
        <div className="card-body">
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Login</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">RUT</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario.rut}>
                                <th scope="row">{index + 1}</th>
                                <td>{usuario.login}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.rut}-{usuario.vrut}</td>
                                <td>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => onManageClick(usuario)}>
                                        Gestionar Módulos
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default UserTable;
