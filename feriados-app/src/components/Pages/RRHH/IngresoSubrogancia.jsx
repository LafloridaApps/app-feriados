import { useState } from 'react';
import Swal from 'sweetalert2';
import { useFuncionarioSearch } from '../../../hooks/useFuncionarioSearch';
import { saveSubrogancia } from '../../../services/subroganciaService'; // Importar el servicio
import './IngresoSubrogancia.css'; // Importar el archivo CSS personalizado

const IngresoSubrogancia = () => {
    const jefe = useFuncionarioSearch();
    const subrogante = useFuncionarioSearch();

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [isSaving, setIsSaving] = useState(false); // Estado para el proceso de guardado

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Validaciones previas
        if (!jefe.nombre || !subrogante.nombre) {
            Swal.fire({ icon: 'warning', title: 'Datos Incompletos', text: 'Debe buscar y confirmar tanto al jefe como al subrogante.' });
            setIsSaving(false);
            return;
        }
        if (!fechaInicio || !fechaFin) {
            Swal.fire({ icon: 'warning', title: 'Fechas Incompletas', text: 'Debe seleccionar tanto la fecha de inicio como la de fin.' });
            setIsSaving(false);
            return;
        }
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        if (inicio > fin) {
            Swal.fire({ icon: 'error', title: 'Fechas Inválidas', text: 'La fecha de inicio no puede ser posterior a la fecha de fin.' });
            setIsSaving(false);
            return;
        }

        // Construir el objeto para la API
        const subroganciaData = {
            rutJefe: jefe.rutSinDV,
            rutSubrogante: subrogante.rutSinDV,
            fechaInicio,
            fechaFin,
            idDepto: jefe.idDepto // Asumimos que el depto es el del jefe
        };

        try {
            const response = await saveSubrogancia(subroganciaData);
            // Se acepta cualquier código de estado 2xx como éxito.
            if (response && response.status >= 200 && response.status < 300) {
                Swal.fire({
                    icon: 'success',
                    title: 'Subrogancia Guardada',
                    text: 'La subrogancia ha sido registrada correctamente.',
                });
                // Limpiar el formulario
                jefe.reset();
                subrogante.reset();
                setFechaInicio('');
                setFechaFin('');
            } else {
                // Esto se ejecutaría si la respuesta no es 2xx, lo cual es poco común para un caso de no-error.
                throw new Error(response?.data?.message || 'La respuesta del servidor no fue exitosa.');
            }
        } catch (error) {
            console.error("Error al guardar subrogancia:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al Guardar',
                text: error.message || 'No se pudo registrar la subrogancia.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="ingreso-subrogancia-container">
            <div className="card shadow-sm ingreso-subrogancia-card">
                <div className="card-header ingreso-subrogancia-card-header">
                    <h4 className="mb-0">Ingreso Manual de Subrogancia</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 ingreso-subrogancia-form-section">
                                <h5>Datos del Jefe</h5>
                                <div className="mb-3">
                                    <label htmlFor="rutJefe" className="form-label">RUT del Jefe</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="rutJefe" value={jefe.rut} onChange={jefe.handleRutChange} placeholder="Ej: 12345678-9" />
                                        <button className="btn btn-outline-secondary" type="button" onClick={jefe.handleBuscar}>Buscar</button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del Jefe</label>
                                    <p className="form-control-plaintext bg-light p-2 rounded ingreso-subrogancia-form-control-plaintext">{jefe.nombre || '(Resultado de la búsqueda)'}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Departamento del Jefe</label>
                                    <p className="form-control-plaintext bg-light p-2 rounded ingreso-subrogancia-form-control-plaintext">{jefe.departamento || '(Resultado de la búsqueda)'}</p>
                                </div>
                            </div>
                            <div className="col-md-6 ingreso-subrogancia-form-section">
                                <h5>Datos del Subrogante</h5>
                                <div className="mb-3">
                                    <label htmlFor="rutSubrogante" className="form-label">RUT del Subrogante</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="rutSubrogante" value={subrogante.rut} onChange={subrogante.handleRutChange} placeholder="Ej: 98765432-1" />
                                        <button className="btn btn-outline-secondary" type="button" onClick={subrogante.handleBuscar}>Buscar</button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del Subrogante</label>
                                    <p className="form-control-plaintext bg-light p-2 rounded ingreso-subrogancia-form-control-plaintext">{subrogante.nombre || '(Resultado de la búsqueda)'}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Departamento del Subrogante</label>
                                    <p className="form-control-plaintext bg-light p-2 rounded ingreso-subrogancia-form-control-plaintext">{subrogante.departamento || '(Resultado de la búsqueda)'}</p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="ingreso-subrogancia-form-section">
                            <h5>Período de Subrogancia</h5>
                            <div className="row mt-2">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fechaInicio" className="form-label">Fecha de Inicio</label>
                                    <input type="date" className="form-control" id="fechaInicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fechaFin" className="form-label">Fecha de Fin</label>
                                    <input type="date" className="form-control" id="fechaFin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                {isSaving ? 'Guardando...' : 'Guardar Subrogancia'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default IngresoSubrogancia;
