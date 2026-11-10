export const tieneDocumentoAprobado = estado => ['APROBADA', 'DECRETADA'].includes(estado);

export const normalizarUrlPdf = valor => {
    if (typeof valor !== 'string') return '';
    const url = valor.replace(/[\r\n\t]/g, '').trim();
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
    } catch {
        return '';
    }
};
