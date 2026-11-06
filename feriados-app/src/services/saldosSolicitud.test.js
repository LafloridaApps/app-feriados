import test from 'node:test';
import assert from 'node:assert/strict';
import { cargarSaldosSolicitud } from './saldosSolicitud.js';

const persona = { rut: 12345678, ident: 4 };
const administrativo = { maximo: 6, usados: 4.5, saldo: 1.5, anio: 2026, detalle: [] };
const feriado = { anio: 2026, diasCorresponden: 15, diasAcumulados: 5, diasTomados: 8,
    diasPendientes: 12, total: 20, diasPerdidos: 0, detalle: [] };
const consultar = (adm = administrativo, fer = feriado) => ({
    consultarAdministrativos: async () => adm, consultarFeriados: async () => fer
});

test('consulta ambas API con el RUT e identificador del beneficiario', async () => {
    const llamadas = [];
    const datos = await cargarSaldosSolicitud(persona, {
        consultarAdministrativos: async (...args) => { llamadas.push(args); return administrativo; },
        consultarFeriados: async (...args) => { llamadas.push(args); return feriado; }
    }, 2026);
    assert.deepEqual(llamadas, [[persona.rut, persona.ident], [persona.rut, persona.ident]]);
    assert.equal(datos.datosAdministrativos.resumen.saldo, 1.5);
    assert.equal(datos.datosFeriados.resumen.dias_pendientes, 12);
    assert.deepEqual(datos.errores, []);
});

test('el saldo cero es válido y se conserva como cero', async () => {
    const datos = await cargarSaldosSolicitud(persona, consultar({ ...administrativo, saldo: 0 }, { ...feriado, diasPendientes: 0 }), 2026);
    assert.equal(datos.datosAdministrativos.resumen.saldo, 0);
    assert.equal(datos.datosFeriados.resumen.dias_pendientes, 0);
    assert.deepEqual(datos.errores, []);
});

test('una respuesta incompleta no se convierte en saldo cero', async () => {
    const datos = await cargarSaldosSolicitud(persona, consultar({}, null), 2026);
    assert.equal(datos.datosAdministrativos, null);
    assert.equal(datos.datosFeriados, null);
    assert.equal(datos.errores.length, 2);
});

test('informa la API que falla y conserva el otro saldo disponible', async () => {
    const datos = await cargarSaldosSolicitud(persona, {
        consultarAdministrativos: async () => { throw new Error('Sin conexión'); },
        consultarFeriados: async () => feriado
    }, 2026);
    assert.equal(datos.datosAdministrativos, null);
    assert.equal(datos.datosFeriados.resumen.dias_pendientes, 12);
    assert.match(datos.errores[0], /administrativos/);
});

test('solo entrega el detalle del año actual a las validaciones compartidas', async () => {
    const actual = { fechaInicio: '2026-03-02' };
    const datos = await cargarSaldosSolicitud(persona, consultar(administrativo, {
        ...feriado, detalle: [actual, { fechaInicio: '2025-02-03' }]
    }), 2026);
    assert.deepEqual(datos.datosFeriados.detalle, [actual]);
});

test('no consulta usando un identificador vacío ni sustituye por el del gestor', async () => {
    let consultas = 0;
    const cargar = async () => { consultas++; };
    const datos = await cargarSaldosSolicitud({ rut: persona.rut, ident: null }, {
        consultarAdministrativos: cargar, consultarFeriados: cargar
    }, 2026);
    assert.equal(consultas, 0);
    assert.equal(datos.errores.length, 1);
});

test('rechaza feriados sin año y saldos no numéricos', async () => {
    const datos = await cargarSaldosSolicitud(persona, consultar({ ...administrativo, saldo: 'inválido' }, { ...feriado, anio: null }), 2026);
    assert.equal(datos.datosAdministrativos, null);
    assert.equal(datos.datosFeriados, null);
});
