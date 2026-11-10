import { useState } from 'react';
import PropTypes from 'prop-types';
import { normalizarUrlPdf, tieneDocumentoAprobado } from '../../../Solicitudes/SolicitudTerceros/historialSolicitudUtils';

const DocumentoSolicitud = ({ solicitud }) => {
    const [descargando, setDescargando] = useState(false);
    const [error, setError] = useState('');
    const url = normalizarUrlPdf(solicitud.urlPdf);
    const id = solicitud.id || solicitud.idSolicitud;
    if (!tieneDocumentoAprobado(solicitud.estadoSolicitud)) return null;

    const descargar = async () => {
        setDescargando(true);
        setError('');
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Documento no disponible');
            const blob = await response.blob();
            if (!(await blob.slice(0, 5).text()).startsWith('%PDF-')) throw new Error('Documento inválido');
            const archivo = URL.createObjectURL(blob);
            const enlace = document.createElement('a');
            enlace.href = archivo;
            enlace.download = `solicitud-${id}.pdf`;
            document.body.append(enlace);
            enlace.click();
            enlace.remove();
            setTimeout(() => URL.revokeObjectURL(archivo), 1000);
        } catch {
            setError('No fue posible descargar el documento. Puedes abrirlo con «Ver PDF» y guardarlo desde el navegador.');
        } finally {
            setDescargando(false);
        }
    };

    return <section className="border rounded-3 bg-light p-3 mb-3" aria-label="Documento de la solicitud">
        <h4 className="h6 fw-bold"><i className="bi bi-file-earmark-pdf me-2" aria-hidden="true" />Documento aprobado</h4>
        {url ? <>
            <p className="small text-muted">Consulta o recupera el PDF de esta solicitud.</p>
            <div className="d-flex flex-wrap gap-2">
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">Ver PDF</a>
                <button type="button" className="btn btn-primary btn-sm" disabled={descargando} onClick={descargar}>
                    <i className="bi bi-download me-2" aria-hidden="true" />{descargando ? 'Descargando…' : 'Descargar PDF'}
                </button>
            </div>
            {error && <p role="alert" className="small text-danger mt-3 mb-0">{error}</p>}
        </> : <p className="small text-muted mb-0">El PDF aprobado aún no está disponible.</p>}
    </section>;
};

DocumentoSolicitud.propTypes = { solicitud: PropTypes.object.isRequired };
export default DocumentoSolicitud;
