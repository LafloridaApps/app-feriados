import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizarUrlPdf, tieneDocumentoAprobado } from './historialSolicitudUtils.js';

test('permite recuperar documentos aprobados y decretados', () => {
    assert.equal(tieneDocumentoAprobado('APROBADA'), true);
    assert.equal(tieneDocumentoAprobado('DECRETADA'), true);
    for (const estado of ['PENDIENTE', 'ANULADA', 'POSTERGADA', undefined]) {
        assert.equal(tieneDocumentoAprobado(estado), false);
    }
});

test('normaliza saltos de línea presentes en URLs guardadas', () => {
    assert.equal(normalizarUrlPdf(' https://appx.laflorida.cl/firma-docs/\r\ndocs_firmados/permisos/archivo.pdf\n'),
        'https://appx.laflorida.cl/firma-docs/docs_firmados/permisos/archivo.pdf');
    assert.equal(normalizarUrlPdf(null), '');
    assert.equal(normalizarUrlPdf('javascript:alert(1)'), '');
});
