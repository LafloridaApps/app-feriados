const agregarAusencia = (ausenciasProcesadas, cadenaFecha, empleado) => {
    if (!ausenciasProcesadas[cadenaFecha]) {
        ausenciasProcesadas[cadenaFecha] = { detalles: {} };
    }

    const nombreGrupo = empleado.nombreGrupo;
    if (!ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo]) {
        ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo] = [];
    }

    if (!ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo].some(e => e.rut === empleado.rut)) {
        ausenciasProcesadas[cadenaFecha].detalles[nombreGrupo].push(empleado);
    }
};

const procesarAusenciaEmpleado = (empleado, ausenciasProcesadas, processedFeriados) => {
    const inicioParts = empleado.periodoAusencia.fechaInicio.split(/[-/]/);
    const inicio = new Date(inicioParts[0], inicioParts[1] - 1, inicioParts[2]);
    const finParts = empleado.periodoAusencia.fechaFin.split(/[-/]/);
    const fin = new Date(finParts[0], finParts[1] - 1, finParts[2]);
    let fechaTemporal = new Date(inicio);

    while (fechaTemporal <= fin) {
        const dayOfWeek = fechaTemporal.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const cadenaFecha = `${fechaTemporal.getFullYear()}-${(fechaTemporal.getMonth() + 1).toString().padStart(2, '0')}-${fechaTemporal.getDate().toString().padStart(2, '0')}`;
        const isFeriado = processedFeriados.has(cadenaFecha);

        // Solo procesar si no es fin de semana y no es feriado
        if (!isWeekend && !isFeriado) {
            agregarAusencia(ausenciasProcesadas, cadenaFecha, empleado);
        }
        fechaTemporal = new Date(fechaTemporal.getFullYear(), fechaTemporal.getMonth(), fechaTemporal.getDate() + 1);
    }
};

export const procesarAusencias = (absenceList, processedFeriados) => {
    const ausenciasProcesadas = {};
    absenceList.forEach(empleado => {
        procesarAusenciaEmpleado(empleado, ausenciasProcesadas, processedFeriados);
    });
    return ausenciasProcesadas;
};

const convertirLicenciaAEmpleado = (licencia) => ({
    nombreGrupo: licencia.nombreGrupo,
    nombre: licencia.nombre,
    rut: String(licencia.rut),
    motivo: 'LICENCIA',
    idSolicitud: null,
    fechaAprobacion: null,
    periodoAusencia: {
        fechaInicio: licencia.fechaInicio,
        fechaFin: licencia.fechaTermino
    }
});

export const normalizarAusencias = (data) => {
    if (Array.isArray(data)) return data;
    const ausencias = Array.isArray(data?.ausencias) ? data.ausencias : [];
    const licencias = Array.isArray(data?.licencias) ? data.licencias : [];
    return [...ausencias, ...licencias.map(convertirLicenciaAEmpleado)];
};

