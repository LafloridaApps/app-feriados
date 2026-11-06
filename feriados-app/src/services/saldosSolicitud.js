const numero = (value) => {
    if (value === null || value === undefined || typeof value === 'boolean' || String(value).trim() === '') {
        throw new Error('Información de saldo incompleta.');
    }
    const resultado = Number(value);
    if (!Number.isFinite(resultado)) throw new Error('Información de saldo inválida.');
    return resultado;
};

const detalleDelAnio = (detalle, anio) => (Array.isArray(detalle) ? detalle : []).filter(item => {
    const fecha = new Date(item.fechaInicio);
    return !Number.isNaN(fecha.getTime()) && fecha.getFullYear() === anio;
});

export async function cargarSaldosSolicitud({ rut, ident }, { consultarAdministrativos, consultarFeriados }, anio) {
    if (!rut || ident === null || ident === undefined || String(ident).trim() === '') {
        return { datosAdministrativos: null, datosFeriados: null,
            errores: ['No se pueden consultar los saldos: falta el RUT o el identificador del funcionario seleccionado.'] };
    }
    const resultados = await Promise.allSettled([
        Promise.resolve().then(() => consultarAdministrativos(rut, ident)).then(respuesta => ({
            ...respuesta,
            resumen: { maximo: numero(respuesta?.maximo), usados: numero(respuesta?.usados),
                saldo: numero(respuesta?.saldo), anio: respuesta?.anio ?? anio },
            detalle: detalleDelAnio(respuesta?.detalle, anio)
        })),
        Promise.resolve().then(() => consultarFeriados(rut, ident)).then(respuesta => {
            // Una respuesta vacía de feriados puede contener ceros por defecto; el año distingue los datos consultados.
            if (!respuesta?.anio) throw new Error('No se recibió información de feriados.');
            return { ...respuesta,
                resumen: { anio: respuesta.anio, dias_corresponden: numero(respuesta.diasCorresponden),
                    dias_acumulados: numero(respuesta.diasAcumulados), dias_tomados: numero(respuesta.diasTomados),
                    dias_pendientes: numero(respuesta.diasPendientes), total: numero(respuesta.total),
                    dias_perdidos: numero(respuesta.diasPerdidos) },
                detalle: detalleDelAnio(respuesta.detalle, anio) };
        })
    ]);
    return {
        datosAdministrativos: resultados[0].status === 'fulfilled' ? resultados[0].value : null,
        datosFeriados: resultados[1].status === 'fulfilled' ? resultados[1].value : null,
        errores: resultados.flatMap((resultado, i) => resultado.status === 'rejected'
            ? [`No se pudieron obtener los saldos de ${i === 0 ? 'días administrativos' : 'feriados legales'} de la persona seleccionada.`] : [])
    };
}
