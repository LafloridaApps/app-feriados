import { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { decretar } from '../services/decretarService';
import { getDocDecreto, getExcelDecreto } from '../services/docService.js';
import { listTemplates } from '../services/templateService';
import { UsuarioContext } from '../context/UsuarioContext';

/**
 * @typedef {Object} DecretoSolicitud
 * @property {number|string} nroDecreto
 */

/**
 * @typedef {Object} DecretoResponse
 * @property {DecretoSolicitud[]} solicitudes - At least one entry with a valid nroDecreto.
 */

/**
 * Validates the shape of the decretar response.
 * @param {any} response
 * @returns {{ ok: boolean, nroDecreto: (number|string|null), error: string|null }}
 */
const validarRespuestaDecreto = (response) => {
    if (!response || typeof response !== 'object') {
        return { ok: false, nroDecreto: null, error: 'Respuesta vacía del servidor.' };
    }
    const solicitudes = response.solicitudes;
    if (!Array.isArray(solicitudes) || solicitudes.length === 0) {
        return { ok: false, nroDecreto: null, error: 'El servidor no devolvió solicitudes para el decreto.' };
    }
    const nroDecreto = solicitudes[0]?.nroDecreto;
    if (nroDecreto === undefined || nroDecreto === null || nroDecreto === '') {
        return { ok: false, nroDecreto: null, error: 'El servidor no devolvió un número de decreto válido.' };
    }
    return { ok: true, nroDecreto, error: null };
};

export const useGeneracionDecretos = ({ selectedItems, setLoading, mostrarAlertaError, handleLimpiarFiltros }) => {
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const funcionario = useContext(UsuarioContext);

    const handleOpenTemplateModal = async () => {
        if (selectedItems.length === 0) {
            mostrarAlertaError('Debe seleccionar al menos una aprobación.');
            return;
        }
        try {
            setLoading(true);
            const templateList = await listTemplates();
            setTemplates(templateList);
            if (templateList.length > 0) {
                setSelectedTemplate(templateList[0].nombre);
            }
            setShowTemplateModal(true);
        } catch (error) {
            mostrarAlertaError('Error al cargar las plantillas.', error.message);
            console.error('Error al cargar las plantillas:', error.response ? error.response.data : error);
        } finally {
            setLoading(false);
        }
    };

    const descargarArchivo = async (getFn, filename, tipo) => {
        try {
            console.log(`[${tipo}] Descargando archivo:`, filename);
            const response = await getFn();
            const url = globalThis.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            globalThis.URL.revokeObjectURL(url);
            console.log(`[${tipo}] Archivo descargado exitosamente`);
            return true;
        } catch (error) {
            console.error(`[${tipo}] Error:`, error.response?.data || error.message);
            mostrarAlertaError(`Error al descargar el ${tipo === 'Word' ? 'documento Word' : 'Excel'}.`, error.message || 'Ocurrió un error inesperado.');
            return false;
        }
    };

    const procesarWord = async (nroDecreto) => {
        if (!nroDecreto) {
            throw new Error("No se encontró el 'nroDecreto' en la respuesta.");
        }
        return descargarArchivo(() => getDocDecreto(nroDecreto), `decreto_${nroDecreto}.docx`, 'Word');
    };

    const procesarExcelBackend = async (nroDecreto) => {
        if (!nroDecreto) {
            throw new Error("No se encontró el 'nroDecreto' en la respuesta.");
        }
        return descargarArchivo(() => getExcelDecreto(nroDecreto), `solicitudes-${nroDecreto}.xlsx`, 'Excel');
    };

    const validarGeneracion = (templateName) => {
        if (!templateName) { mostrarAlertaError('Debe seleccionar una plantilla.'); return false; }
        if (selectedItems.length === 0) { mostrarAlertaError('Debe seleccionar al menos una aprobación para generar un decreto.'); return false; }
        if (!funcionario?.rut) { mostrarAlertaError('No se pudo obtener el RUT del usuario para generar el decreto.'); return false; }
        return true;
    };

    const setupDownloadButtons = (nroDecreto) => {
        document.querySelectorAll('.swal2-download-btn').forEach(btn => {
            if (btn.dataset.listenerAttached) return;
            btn.dataset.listenerAttached = 'true';
            btn.addEventListener('click', async (e) => {
                const tipo = e.target.dataset.tipo;
                e.target.disabled = true;
                e.target.textContent = 'Descargando...';
                try {
                    if (tipo === 'word') await procesarWord(nroDecreto);
                    else await procesarExcelBackend(nroDecreto);
                    e.target.textContent = '✅ Descargado';
                    e.target.style.opacity = '0.6';
                } catch {
                    e.target.textContent = 'Reintentar';
                    e.target.disabled = false;
                }
            });
        });
    };

    const mostrarDialogoDescarga = (nroDecreto, wordSuccess, excelSuccess) => {
        const btnWord = wordSuccess ? '' : `<button class="swal2-download-btn" data-tipo="word" style="background:#0d6efd;color:white;border:none;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:13px">Descargar</button>`;
        const btnExcel = excelSuccess ? '' : `<button class="swal2-download-btn" data-tipo="excel" style="background:#198754;color:white;border:none;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:13px">Descargar</button>`;

       void  Swal.fire({
            icon: wordSuccess && excelSuccess ? 'success' : 'warning',
            title: 'Decreto Generado',
            html: `
                <div style="text-align:left">
                    <p><strong>Nro Decreto:</strong> #${nroDecreto}</p>
                    <hr>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px${wordSuccess ? '' : ';opacity:0.6'}">
                        <span>${wordSuccess ? '✅' : '❌'} <strong>Word</strong>${wordSuccess ? ' <small class="text-muted">(descargado)</small>' : ''}</span>
                        ${btnWord}
                    </div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px${excelSuccess ? '' : ';opacity:0.6'}">
                        <span>${excelSuccess ? '✅' : '❌'} <strong>Excel</strong>${excelSuccess ? ' <small class="text-muted">(descargado)</small>' : ''}</span>
                        ${btnExcel}
                    </div>
                </div>
            `,
            confirmButtonText: 'Cerrar',
            didRender: () => setupDownloadButtons(nroDecreto),
        });
    };

    const handleGenerarDecreto = async (templateName) => {
        if (!validarGeneracion(templateName)) return;

        const templateObj = templates.find(t => t.nombre === templateName);
        if (!templateObj) {
            mostrarAlertaError('La plantilla seleccionada no es válida.');
            return;
        }

        setLoading(true);
        setShowTemplateModal(false);
        try {
            const payload = { ids: selectedItems, rut: funcionario.rut, template: templateObj.docFile };
            console.log('[handleGenerarDecreto] Enviando payload:', JSON.stringify(payload));
            const response = await decretar(payload);

            const { ok, nroDecreto, error } = validarRespuestaDecreto(response);
            if (!ok) {
                console.error('[handleGenerarDecreto] Respuesta inesperada:', JSON.stringify(response));
                mostrarAlertaError(error || 'No se recibieron datos válidos del servidor.');
                return;
            }

            console.log('[handleGenerarDecreto] Decreto generado. nroDecreto:', nroDecreto, 'rutaWord:', response.rutaWord, 'rutaExcel:', response.rutaExcel);

            const wordSuccess = await procesarWord(nroDecreto);
            const excelSuccess = await procesarExcelBackend(nroDecreto);

            handleLimpiarFiltros();
            mostrarDialogoDescarga(nroDecreto, wordSuccess, excelSuccess);
        } catch (error) {
            const errorData = error.response?.data;
            console.error('[handleGenerarDecreto] Error completo:', { status: error.response?.status, data: errorData, message: error.message });
            mostrarAlertaError('Error al generar el decreto', errorData?.mensaje || error.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return {
        showTemplateModal, setShowTemplateModal,
        templates, selectedTemplate, setSelectedTemplate,
        handleOpenTemplateModal, handleGenerarDecreto,
    };
};
