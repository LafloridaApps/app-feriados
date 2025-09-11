import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { listTemplates, deleteTemplate, viewTemplate } from '../services/templateService';

export const useTemplates = () => {
    const [templates, setTemplates] = useState([]);

    const fetchTemplates = useCallback(async () => {
        try {
            const templatesData = await listTemplates();
            setTemplates(templatesData);
        } catch (error) {
            console.error("Error al obtener plantillas:", error);
            Swal.fire({
                icon: "error",
                title: "Error al cargar plantillas",
                text: "No se pudieron obtener las plantillas existentes.",
            });
        }
    }, []);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteTemplate(id);
                    Swal.fire(
                        'Eliminado!',
                        response.message,
                        'success'
                    );
                    fetchTemplates();
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        error.data,
                        'error'
                    );
                }
            }
        });
    };

    const handleView = async (docFile, nombrePlantilla) => {
        if (!docFile) {
            Swal.fire('Error', 'No hay un archivo asociado para ver.', 'error');
            return;
        }

        Swal.fire({
            title: 'Descargando documento',
            text: 'Por favor, espera un momento...',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const blob = await viewTemplate(docFile);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = nombrePlantilla.toLowerCase().endsWith('.docx') ? nombrePlantilla : `${nombrePlantilla}.docx`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            Swal.close();
        } catch (error) {
            Swal.close();
            Swal.fire(
                'Error de descarga',
                'No se pudo descargar el documento. Por favor, inténtalo de nuevo.',
                'error'
            );
            console.error("Error en handleView:", error);
        }
    };

    return { templates, handleDelete, handleView, fetchTemplates };
};
