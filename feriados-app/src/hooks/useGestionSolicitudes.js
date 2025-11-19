import { useState, useCallback, useEffect } from 'react';
import { getSolicitudById, updateSolicitud, repairUrl } from '../services/solicitudService';
import Swal from 'sweetalert2';

export const useGestionSolicitudes = () => {
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editableData, setEditableData] = useState({
        fechaInicio: '',
        fechaTermino: '',
        estadoSolicitud: '',
    });

    useEffect(() => {
        if (solicitud) {
            setEditableData({
                fechaInicio: solicitud.fechaInicio.split('T')[0],
                fechaTermino: solicitud.fechaTermino.split('T')[0],
                estadoSolicitud: solicitud.estadoSolicitud,
            });
        }
    }, [solicitud]);

    const buscarSolicitud = useCallback(async (id) => {
        if (!id) {
            setError('Por favor, ingrese un ID de solicitud.');
            setSolicitud(null);
            return;
        }
        setLoading(true);
        setError(null);
        setSolicitud(null);
        try {
            const data = await getSolicitudById(id);
            setSolicitud(data);
        } catch (err) {
            setError('Error al buscar la solicitud. Verifique el ID e intente nuevamente.');
            setSolicitud(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUpdateSolicitud = async () => {
        
     
        setLoading(true);
        try {
            await updateSolicitud(solicitud.idSolicitud, editableData);
            
            Swal.fire('¡Éxito!', 'La solicitud ha sido actualizada.', 'success');
            buscarSolicitud(solicitud.idSolicitud); // Re-fetch to show updated data
        } catch (err) {
            Swal.fire('Error', 'No se pudo actualizar la solicitud.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRepairUrl = async () => {
        if (!solicitud) return;
        setLoading(true);
        try {
            await repairUrl(solicitud.idSolicitud);
            Swal.fire('¡Éxito!', 'Se ha iniciado el proceso para re-firmar el documento.', 'success');
            buscarSolicitud(solicitud.idSolicitud); // Re-fetch to show updated data
        } catch (err) {
            Swal.fire('Error', 'No se pudo iniciar el proceso de re-firma.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({ ...prev, [name]: value }));
    };

    return {
        solicitud,
        loading,
        error,
        editableData,
        buscarSolicitud,
        handleUpdateSolicitud,
        handleRepairUrl,
        handleInputChange,
    };
};